from glob import glob
from io import BytesIO
import subprocess
import zipfile
import os

from fastapi.responses import StreamingResponse


VIDEO_DIR = os.path.join(os.getcwd(), '../data')


def merge_frames(video_id, api_key):
	""" Stitch together multiple screen captures into a single frame for handling
	vertical scrolling. """
	path = os.path.join(VIDEO_DIR, api_key, video_id, 'frames')
	if not os.path.exists(path):
		return

	index = 0
	while True:
		frame_pattern = str(index).zfill(5)
		frame_set = glob(os.path.join(path, f'{frame_pattern}_*.png'))
		if not frame_set:
			break

		frame_set.sort()

		subprocess.run([
			'convert',
			*frame_set,
			'-append',
			os.path.join(path, f'{frame_pattern}.png'),
		], check=True)

		for frame in frame_set:
			os.remove(frame)

		index += 1


def get_max_wh(action_map):
	""" Returns the maximum height and width of the frames. """
	max_h = 0
	max_w = 0

	def dfs(action):
		nonlocal max_h, max_w
		if 'capturedImageSize' in action:
			max_h = max(max_h, action['capturedImageSize'][1])
			max_w = max(max_w, action['capturedImageSize'][0])
		for child in action['children']:
			dfs(child)
	dfs(action_map)

	return max_w, max_h


def encode_video(video_id, action_map, api_key):
	""" Creates an mp4 from the frames sent to the server. """
	cwd = os.getcwd()

	path = os.path.join(VIDEO_DIR, api_key, video_id, 'frames')
	if not os.path.exists(path):
		return

	max_wh = get_max_wh(action_map)

	os.chdir(path)
	try: 
		subprocess.run([
			'ffmpeg',
			'-y',
			'-framerate',
			'1',
			'-i',
			'%05d.png',
			'-c:v',
			'libx264',
			'-vf',
			f'pad=ceil({max_wh[0]}/2)*2:ceil({max_wh[1]}/2)*2',
			# 'pad=ceil(iw/2)*2:ceil(ih/2)*2',
			'-profile:v',
			'high',
			'-crf',
			'20',
			'-pix_fmt',
			'yuv420p',
			'../video.mp4'
		], check=True)
	except subprocess.CalledProcessError as e:
		print(e)

	os.chdir(cwd)
	# rmtree(path)


def stat_video(video_id, api_key):
	""" Returns the information on the videofile. """
	path = os.path.join(VIDEO_DIR, api_key, video_id, 'video.mp4')
	if not os.path.exists(path):
		return None

	return os.stat(path)


def zipfiles(file_list):
	""" Zip a list of files and stream the resulting archive. """
	io = BytesIO()
	zip_sub_dir = "final_archive"
	zip_filename = f"{zip_sub_dir}.zip"
	with zipfile.ZipFile(io, mode='w', compression=zipfile.ZIP_DEFLATED) as _zip:
		for fpath in file_list:
			_zip.write(fpath, os.path.basename(fpath))
		# close zip
		_zip.close()
	return StreamingResponse(
		iter([io.getvalue()]),
		media_type="application/x-zip-compressed",
		headers={"Content-Disposition": f"attachment;filename={zip_filename}"}
	)


def scale_video(video_id, device_pixel_ratio, api_key):
	""" Scales the video down to the devicePixelRatio. """
	if device_pixel_ratio == 1:
		return

	cwd = os.getcwd()

	path = os.path.join(VIDEO_DIR, api_key, video_id)
	if not os.path.exists(path):
		return

	os.chdir(path)
	# ffmpeg -i video.mp4 -vf scale="iw/2:-2" video.cpy.mp4
	subprocess.run([
		'ffmpeg',
		'-y',
		'-i',
		'video.mp4',
		'-vf',
		f'scale=iw/{device_pixel_ratio}:-2',
		'video.tmp.mp4',
	], check=True)
	subprocess.run([
		'mv',
		'video.tmp.mp4',
		'video.mp4',
	], check=True)
	os.chdir(cwd)
