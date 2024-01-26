from base64 import b64decode
import contextlib
from datetime import datetime
import os
import json
import secrets
from shutil import copy, rmtree
import subprocess
from uuid import uuid4

from fastapi import (
	BackgroundTasks,
	Depends,
	FastAPI,
	Header,
	HTTPException,
	Request
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel
import requests
import spacy
from sqlalchemy import select


from .db import User, create_db_and_tables, get_async_session, get_user_db
from .schemas import UserCreate, UserRead, UserUpdate
from .text_processing import (
	cleanActionMapTags
)
from .users import auth_backend, current_active_user, fastapi_users
from .util import (
	encode_video,
	merge_frames,
	scale_video,
	zipfiles,
	stat_video
)
from .vector_db import (
	query_image_vec_db,
	query_text_vec_db,
	add_videos_to_vec_db,
	add_text_to_vec_db,
	delete_id_vec_db,
	image_from_bin,
)


VIDEO_DIR = os.path.join(os.getcwd(), 'data')
if not os.path.exists(VIDEO_DIR):
	try:
		os.mkdir(VIDEO_DIR, mode=0o744)
	except FileExistsError:
		pass
	except FileNotFoundError as exc:
		raise HTTPException(
			status_code=404,
			detail='Videos directory not found and can not be created.'
		) from exc


class Frame(BaseModel):
	apiKey: str
	frame: str
	position: int
	scrollOffset: int = 0
	scrollPosition: int
	video: str


class Video(BaseModel):
	apiKey: str
	actionMap: object
	complete: bool = False


class Query(BaseModel):
	image: str = None
	text: str = ""
	nResults: int = 1


app = FastAPI()
app.add_middleware(
	CORSMiddleware,
	allow_headers=['*'],
	allow_methods=['*'],
	allow_origins=['*']
)

app.include_router(
	fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"]
)
app.include_router(
	fastapi_users.get_register_router(UserRead, UserCreate),
	prefix="/auth",
	tags=["auth"],
)
app.include_router(
	fastapi_users.get_reset_password_router(),
	prefix="/auth",
	tags=["auth"],
)
app.include_router(
	fastapi_users.get_verify_router(UserRead),
	prefix="/auth",
	tags=["auth"],
)
app.include_router(
	fastapi_users.get_users_router(UserRead, UserUpdate),
	prefix="/users",
	tags=["users"],
)

get_async_session_context = contextlib.asynccontextmanager(get_async_session)
get_user_db_context = contextlib.asynccontextmanager(get_user_db)


# get the embedder model and populate the db (if any videos exist)
IMAGE_VEC_COLLECTION_NAME = "raiv-image"
TEXT_VEC_COLLECTION_NAME = "raiv-text"
# populate_image_vec_db(VIDEO_DIR, collection_name=IMAGE_VEC_COLLECTION_NAME)
# populate_text_vec_db(VIDEO_DIR, collection_name=TEXT_VEC_COLLECTION_NAME)

# get the spacy nlp model
nlp = spacy.load("en_core_web_sm")


@app.on_event("startup")
async def on_startup():
	await create_db_and_tables()


# Proxy endpoints
def get_proxy_url(request: Request):
	"""
	Get the URL to proxy to.
	Find the right most instance of http:// or https:// to avoid any issues
	"""
	url = request.url.path
	http, https = url.rfind('http://'), url.rfind('https://')
	if http == -1 and https == -1:
		raise HTTPException(status_code=400)
	return f"{request.url.path[max(http, https):]}?{request.url.query}"


@app.get('/proxy/{path:path}')
async def proxy__get(request: Request):
	""" Proxy requests to the target URL. """
	t_resp = requests.request(
		allow_redirects=False,
		method=request.method,
		timeout=65,
		url=get_proxy_url(request),
	)
	return Response(content=t_resp.content, status_code=t_resp.status_code)


# API key auth
async def verify(api_key):
	user = None

	async with get_async_session_context() as session:
		result = await session.execute(select(User).where(User.api_key == api_key))
		for row in result:
			user = row[0]

	return user


# Recording endpoints
@app.post('/frame/')
async def frame__post(frame: Frame):
	""" Adds a frame to a video and prepares the frame for encoding. """
	api_key = frame.apiKey
	user = await verify(api_key)
	if not user:
		raise HTTPException(status_code=401)

	path = os.path.join(VIDEO_DIR, frame.video)
	if not frame.video or not os.path.exists(path):
		raise HTTPException(status_code=404)

	frames_dir = os.path.join(path, 'frames')
	if not os.path.exists(frames_dir):
		os.makedirs(frames_dir)

	frame_data = b64decode(frame.frame.split(',')[1])
	fpath = os.path.join(
		frames_dir,
		f'{str(frame.position).zfill(5)}_{str(frame.scrollPosition).zfill(3)}.png'
	)
	with open(fpath, 'wb') as file:
		file.write(frame_data)

	if frame.scrollOffset:
		subprocess.run([
			'convert',
			fpath,
			'-gravity',
			'North',
			'-chop',
			f'0x{frame.scrollOffset}',
			fpath,
		], check=True)


@app.post('/video/')
async def video__post(video: Video):
	""" Creates a new video with no associated frames. """
	api_key = video.apiKey
	user = await verify(api_key)
	if not user:
		raise HTTPException(status_code=401)

	uuid = uuid4().hex

	path = os.path.join(VIDEO_DIR, uuid)
	while os.path.exists(path):
		uuid = uuid4().hex
		path = os.path.join(VIDEO_DIR, uuid)

	os.makedirs(path)
	fpath = os.path.join(path, 'action_map.json')
	with open(fpath, 'w', encoding='utf-8') as file:
		json.dump(video.actionMap, file)
	_update_metadata(uuid, {
		'complete': video.complete,
		'id': uuid,
		'created': datetime.now().isoformat(),
		'updated': datetime.now().isoformat(),
		'size': 0
	})

	return uuid


def _compose_video(video_id, video):
	# update the action map if anything has changed
	action_map = _update_action_map(video_id, video.actionMap)

	# merge frames from scroll if necessary
	merge_frames(video_id)

	path = os.path.join(VIDEO_DIR, video_id)
	copy(
		os.path.join(path, 'frames', '00000.png'),
		os.path.join(path, 'first_frame.png')
	)

	# encode the frames into a video
	encode_video(video_id, action_map)

	# scale the video if necessary
	device_pixel_ratio = action_map.get(
		'metadata', {}).get('device_pixel_ratio', 1)
	scale_video(video_id, device_pixel_ratio)

	# update the metadata
	video_stat = stat_video(video_id)
	_update_metadata(video_id, {
		'complete': video.complete,
		'updated': datetime.now().isoformat(),
		'size': video_stat.st_size
	})

	# add the video to the vector db
	add_videos_to_vec_db(
		VIDEO_DIR,
		[video_id],
		[os.path.join(path, "video.mp4")],
		collection_name=IMAGE_VEC_COLLECTION_NAME
	)

	# clean the action map and update it
	action_map = cleanActionMapTags(nlp, action_map)
	_update_action_map(video_id, action_map)

	# add the tags to the vector db
	add_text_to_vec_db(
		VIDEO_DIR,
		[video_id],
		[os.path.join(path, "action_map.json")],
		collection_name=TEXT_VEC_COLLECTION_NAME
	)


@app.patch('/video/{video_id}/')
async def video__patch(
	video_id,
	video: Video,
	background_tasks: BackgroundTasks
):
	""" Encode the video once the front-end is done sending frames. """
	api_key = video.apiKey
	user = await verify(api_key)
	if not user:
		raise HTTPException(status_code=401)

	if video.complete:
		background_tasks.add_task(_compose_video, video_id, video)

	return video_id


# Player endpoints
@app.get('/user/')
async def user__get(user: User = Depends(current_active_user)):
	""" Retrieves a User object. """
	key = user.api_key
	if not key:
		key = secrets.token_urlsafe(16)

	return {
		'api_key': key,
		'save_key': not user.api_key,
		'first_name': user.first_name,
	}


@app.get('/video/')
async def video__get__list(_: User = Depends(current_active_user)):
	""" Retrieve the list of available videos for the gallery. """
	video_list = os.listdir(VIDEO_DIR)

	objects = []
	for video_id in video_list:
		path = os.path.join(VIDEO_DIR, video_id)
		# and not os.path.exists(os.path.join(path, 'frames')):
		if os.path.isdir(path) and \
			not video_id == "embeddings" and \
			not video_id == "global_swarm_lock":

			with open(
				os.path.join(path, 'action_map.json'), 'r', encoding='utf-8'
			) as action_file:
				action_map = json.load(action_file)
				objects.append({
					'id': video_id,
					'name': action_map.get('name', 'Unnamed Video'),
					'metadata': action_map.get('metadata', {}),
				})

	return objects


@app.delete('/video/{video_id}/')
async def video__delete(video_id, _: User = Depends(current_active_user)):
	""" Deletes a video from the server. """
	path = os.path.join(VIDEO_DIR, video_id)

	if os.path.exists(path):
		rmtree(path)
		delete_id_vec_db(
			VIDEO_DIR,
			video_id,
			collection_name=IMAGE_VEC_COLLECTION_NAME
		)
		delete_id_vec_db(
			VIDEO_DIR,
			video_id,
			collection_name=TEXT_VEC_COLLECTION_NAME
		)


def _get_video_file(video_id, filename):
	""" Gets the path to a file within a video's directory. """
	path = os.path.join(VIDEO_DIR, video_id, filename)

	if not os.path.exists(path):
		raise HTTPException(status_code=404, detail='File not found')

	return path


def _update_action_map(video_id, action_map_new):
	""" Updates the action map for a video. """
	path = os.path.join(VIDEO_DIR, video_id, 'action_map.json')
	action_map = {}
	if os.path.exists(path):
		with open(path, 'r', encoding='utf-8') as file:
			action_map = json.load(file)

	# preserve metadata
	metadata = action_map.get('metadata', {})
	metadata_new = action_map_new.get('metadata', {})

	# update the action map
	action_map.update(action_map_new)

	# preserve metadata
	action_map['metadata'] = metadata
	action_map.get('metadata', {}).update(metadata_new)

	with open(path, 'w', encoding='utf-8') as file:
		json.dump(action_map, file, indent=2)
	return action_map


def _update_metadata(video_id, data):
	""" Updates the metadata file for a video. """
	path = os.path.join(VIDEO_DIR, video_id, 'action_map.json')

	if not os.path.exists(path):
		raise HTTPException(status_code=404, detail='File not found')

	with open(path, 'r', encoding='utf-8') as file:
		action_map = json.load(file)

	if 'metadata' not in action_map:
		action_map['metadata'] = {}
	action_map['metadata'].update(data)

	with open(path, 'w', encoding='utf-8') as file:
		json.dump(action_map, file)


@app.get('/video/{video_id}/meta/')
async def metadata__get__detail(video_id):
	""" Retrieve the action map for a video. """
	return FileResponse(_get_video_file(video_id, 'meta.json'))


@app.get('/video/{video_id}/action-map/')
async def action_map__get__detail(video_id):
	""" Retrieve the action map for a video. """
	return FileResponse(_get_video_file(video_id, 'action_map.json'))


@app.get('/video/{video_id}/preview/')
async def preview__get__detail(video_id):
	""" Retrieve the preview frame for a video for the gallery. """
	return FileResponse(_get_video_file(video_id, 'first_frame.png'))


@app.get('/video/{video_id}/download/')
async def archive__get_download(video_id):
	""" Retrieve a zipfile of the RAIV archive. """
	return zipfiles([
		_get_video_file(video_id, 'video.mp4'),
		_get_video_file(video_id, 'action_map.json'),
	])


@app.get('/video/{video_id}/video/')
async def video__get__detail(video_id, range: str = Header(None)):  # pylint: disable=redefined-builtin # noqa: E501
	""" Stream the video file back to the client. """
	if not range:
		raise HTTPException(
			status_code=404, detail='Video range not specified')

	video_path = _get_video_file(video_id, 'video.mp4')
	filesize = os.path.getsize(video_path)

	start, end = range.replace('bytes=', '').split('-')
	start = int(start)
	end = min(
		int(end) if end else start + 1048576,
		filesize - 1
	)

	with open(video_path, 'rb') as video:
		video.seek(start)
		data = video.read(end - start + 1)

		headers = {
			'Accept-Ranges': 'bytes',
			'Content-Range': f'bytes {str(start)}-{str(end)}/{filesize}',
		}

		return Response(
			data,
			status_code=206,
			headers=headers,
			media_type='video/mp4'
		)


@app.post('/search/image/')
async def video_reverse_image_search(query: Query):
	frame_data = b64decode(query.image.split(',')[1])
	image = image_from_bin(frame_data)
	results = query_image_vec_db(
		VIDEO_DIR,
		image,
		n_results=query.nResults,
		collection_name=IMAGE_VEC_COLLECTION_NAME
	)
	return results


@app.post('/search/text/')
async def video_text_search(query: Query):
	results = query_text_vec_db(
		VIDEO_DIR,
		query.text,
		n_results=query.nResults,
		collection_name=TEXT_VEC_COLLECTION_NAME
	)
	return results


@app.get('/{path:path}')
async def client(path):
	""" All other requests should be forwarded to the client. """
	full_path = os.path.join(os.getcwd(), 'client', 'dist', path)

	if os.path.isdir(full_path):
		full_path = os.path.join(full_path, 'index.html')

	if not os.path.exists(full_path):
		full_path = os.path.join(os.getcwd(), 'client', 'dist', 'index.html')

	return FileResponse(full_path)
