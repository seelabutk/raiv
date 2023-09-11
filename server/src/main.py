import json
import spacy
import os
import requests
import subprocess
from uuid import uuid4
from datetime import datetime
from base64 import b64decode
from shutil import copy, rmtree

from fastapi import (
	Depends, FastAPI, Header, HTTPException,
	Request, BackgroundTasks
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel


from .util import (
	encode_video,
	merge_frames,
	scale_video,
	zipfiles,
	stat_video
)
from .vector_db import (
	populate_image_vec_db,
	populate_text_vec_db,
	query_image_vec_db,
	query_text_vec_db,
	add_videos_to_vec_db,
	add_text_to_vec_db,
	image_from_bin,
)
from .text_processing import (
	cleanActionMapTags
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
	frame: str
	position: int
	scrollOffset: int = 0
	scrollPosition: int
	video: str


class Video(BaseModel):
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
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

API_KEY_FILE = os.path.join(os.getcwd(), 'data', 'api_keys.json')
api_keys = []
if os.path.exists(API_KEY_FILE):
	with open(API_KEY_FILE, encoding='utf-8') as f:
		api_keys = json.load(f)

# get the embedder model and populate the db (if any videos exist)
IMAGE_VEC_COLLECTION_NAME = "raiv-image"
TEXT_VEC_COLLECTION_NAME = "raiv-text"
# populate_image_vec_db(VIDEO_DIR, collection_name=IMAGE_VEC_COLLECTION_NAME)
# populate_text_vec_db(VIDEO_DIR, collection_name=TEXT_VEC_COLLECTION_NAME)

# get the spacy nlp model
nlp = spacy.load("en_core_web_sm")


def validate_token(token: str = Depends(oauth2_scheme)):
	if token not in api_keys:
		raise HTTPException(
			detail='This endpoint requires a valid API Key.',
			status_code=401
		)


def verify_token(video_id, token):
	fpath = os.path.join(VIDEO_DIR, video_id, 'api_key.txt')
	with open(fpath, 'r', encoding='utf-8') as file:
		target = file.read().strip()

		if target != token:
			raise HTTPException(
				detail='This endpoint requires a valid API Key.',
				status_code=401
			)


# Proxy endpoints

def get_proxy_url(request: Request):
	"""
	Get the URL to proxy to.
	Find the right most instance of http:// or https:// to avoid any issues
	"""
	url = request.url.path
	i, j = url.rfind('http://'), url.rfind('https://')
	if i == -1 and j == -1:
		raise HTTPException(status_code=400)
	return f"{request.url.path[max(i, j):]}?{request.url.query}"


@app.get('/proxy/{path:path}')
async def proxy__get(request: Request):
	""" Proxy requests to the target URL. """
	t_resp = requests.request(
		method=request.method,
		url=get_proxy_url(request),
		allow_redirects=False,
	)
	return Response(content=t_resp.content, status_code=t_resp.status_code)

# Recording endpoints


@app.post('/frame/', dependencies=[Depends(validate_token)])
async def frame__post(frame: Frame, token: str = Depends(oauth2_scheme)):
	""" Adds a frame to a video and prepares the frame for encoding. """
	path = os.path.join(VIDEO_DIR, frame.video)
	if not frame.video or not os.path.exists(path):
		raise HTTPException(status_code=404)

	verify_token(frame.video, token)

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


@app.post('/video/', dependencies=[Depends(validate_token)])
async def video__post(video: Video, token: str = Depends(oauth2_scheme)):
	""" Creates a new video with no associated frames. """
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

	fpath = os.path.join(path, 'api_key.txt')
	with open(fpath, 'w', encoding='utf-8') as file:
		file.write(f'{token}\n')

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
	devicePixelRatio = action_map.get(
		'metadata', {}).get('devicePixelRatio', 1)
	scale_video(video_id, devicePixelRatio)

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


@app.patch('/video/{video_id}/', dependencies=[Depends(validate_token)])
async def video__patch(
		video_id,
		video: Video,
		background_tasks: BackgroundTasks,
		token: str = Depends(oauth2_scheme)
):
	""" Encode the video once the front-end is done sending frames. """
	verify_token(video_id, token)

	if video.complete:
		background_tasks.add_task(_compose_video, video_id, video)

	return video_id


# Player endpoints
@app.get('/video/')
async def video__get__list():
	""" Retrieve the list of available videos for the gallery. """
	video_list = os.listdir(VIDEO_DIR)

	objects = []
	for video_id in video_list:
		path = os.path.join(VIDEO_DIR, video_id)
		# and not os.path.exists(os.path.join(path, 'frames')):
		if os.path.isdir(path) and not video_id == "embeddings" and not video_id == "global_swarm_lock":
			with open(
					os.path.join(path, 'action_map.json'), 'r', encoding='utf-8'
			) as action_file:
				actionMap = json.load(action_file)
				objects.append({
					'id': video_id,
					'name': actionMap.get('name', 'Unnamed Video'),
					'metadata': actionMap.get('metadata', {}),
				})

	return objects


@app.delete('/video/{video_id}/', dependencies=[Depends(validate_token)])
async def video__delete(video_id, token: str = Depends(oauth2_scheme)):
	""" Deletes a video from the server. """
	verify_token(video_id, token)

	path = os.path.join(VIDEO_DIR, video_id)

	if os.path.exists(path):
		rmtree(path)


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
		actionMap = json.load(file)

	if 'metadata' not in actionMap:
		actionMap['metadata'] = {}
	actionMap['metadata'].update(data)

	with open(path, 'w', encoding='utf-8') as file:
		json.dump(actionMap, file)


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
		VIDEO_DIR, image, n_results=query.nResults, collection_name=IMAGE_VEC_COLLECTION_NAME)
	return results


@app.post('/search/text/')
async def video_text_search(query: Query):
	results = query_text_vec_db(
		VIDEO_DIR, query.text, n_results=query.nResults, collection_name=TEXT_VEC_COLLECTION_NAME)
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
