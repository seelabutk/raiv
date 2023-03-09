from base64 import b64decode
import json
import os
import shutil
import subprocess
from uuid import uuid4

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel

from .util import encode_video, merge_frames


VIDEO_DIR = os.path.join(os.getcwd(), 'videos')
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


app = FastAPI()
app.add_middleware(
	CORSMiddleware,
	allow_headers=['*'],
	allow_methods=['*'],
	allow_origins=['*']
)
# TODO: CORS generally needs to be available since this server is going to be
# public, but this needs more thought along with authentication


# Recording endpoints
@app.post('/frame/')
async def frame__post(frame: Frame):
	""" Adds a frame to a video and prepares the frame for encoding. """
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
	uuid = uuid4().hex

	path = os.path.join(VIDEO_DIR, uuid)
	while os.path.exists(path):
		uuid = uuid4().hex
		path = os.path.join(VIDEO_DIR, uuid4)

	os.makedirs(path)
	fpath = os.path.join(path, 'action_map.json')
	with open(fpath, 'w', encoding='utf-8') as file:
		json.dump(video.actionMap, file)

	return uuid


@app.patch('/video/{video_id}/')
async def video__patch(video_id, video: Video):
	""" Encode the video once the front-end is done sending frames. """
	if video.complete:
		merge_frames(video_id)

		path = os.path.join(VIDEO_DIR, video_id)
		shutil.copy(
			os.path.join(path, 'frames', '00000.png'),
			os.path.join(path, 'first_frame.png')
		)

		encode_video(video_id)

	return video_id


# Player endpoints
@app.get('/video/')
async def video__get__list():
	""" Retrieve the list of available videos for the gallery. """
	video_list = os.listdir(VIDEO_DIR)

	objects = []
	for video_id in video_list:
		path = os.path.join(VIDEO_DIR, video_id)
		if os.path.isdir(path) and not os.path.exists(os.path.join(path, 'frames')):
			with open(
				os.path.join(path, 'action_map.json'),
				'r',
				encoding='utf-8'
			) as file:
				name = json.load(file).get('name', 'Unnamed Video')

				objects.append({
					'id': video_id,
					'name': name
				})

	return objects


def _get_video_file(video_id, filename):
	""" Gets the path to a file within a video's directory. """
	path = os.path.join(VIDEO_DIR, video_id, filename)

	if not os.path.exists(path):
		raise HTTPException(status_code=404, detail='File not found')

	return path


@app.get('/video/{video_id}/action-map/')
async def action_map__get__detail(video_id):
	""" Retrieve the action map for a video. """
	return FileResponse(_get_video_file(video_id, 'action_map.json'))


@app.get('/video/{video_id}/preview/')
async def preview__get__detail(video_id):
	""" Retrieve the preview frame for a video for the gallery. """
	return FileResponse(_get_video_file(video_id, 'first_frame.png'))


@app.get('/video/{video_id}/video/')
async def video__get__detail(video_id, range: str = Header(None)):  # pylint: disable=redefined-builtin # noqa: E501
	""" Stream the video file back to the client. """
	if not range:
		raise HTTPException(status_code=404, detail='Video range not specified')

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


@app.get('/{path:path}')
async def nuxt(path):
	""" All other requests should be forwarded to Nuxt. """
	try:
		full_path = os.path.join(os.getcwd(), 'nuxt', 'dist', path)
	except FileNotFoundError:
		full_path = os.path.join(os.getcwd(), 'nuxt', 'dist')

	if os.path.isdir(full_path):
		full_path = os.path.join(full_path, 'index.html')

	if not os.path.isfile(full_path):
		fallback = os.path.join(os.getcwd(), 'nuxt', 'dist', 'index.html')

		if not os.path.isfile(fallback):
			# TODO: This is specific to nginx. Is there a generic way to handle this?
			return Response(headers={'X-Accel-Redirect': f'/nuxt/{path}'})

		return FileResponse(os.path.join(fallback))

	return FileResponse(full_path)
