from glob import glob
import os
from shutil import rmtree
import subprocess

VIDEO_DIR = os.path.join(os.getcwd(), 'data')


def merge_frames(video_id):
	""" Stitch together multiple screen captures into a single frame for handling
	vertical scrolling. """
	path = os.path.join(VIDEO_DIR, video_id, 'frames')
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


def encode_video(video_id):
	""" Creates an mp4 from the frames sent to the server. """
	cwd = os.getcwd()

	path = os.path.join(VIDEO_DIR, video_id, 'frames')
	if not os.path.exists(path):
		return

	os.chdir(path)
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
		'pad=ceil(iw/2)*2:ceil(ih/2)*2',
		'-profile:v',
		'high',
		'-crf',
		'20',
		'-pix_fmt',
		'yuv420p',
		'../video.mp4'
	], check=True)
	os.chdir(cwd)

	rmtree(path)

def scale_video(video_id, devicePixelRatio):
	""" Scales the video down to the devicePixelRatio. """
	if devicePixelRatio == 1:
		return

	cwd = os.getcwd()
	
	path = os.path.join(VIDEO_DIR, video_id)
	if not os.path.exists(path):
		return

	os.chdir(path)
	#ffmpeg -i video.mp4 -vf scale="iw/2:-2" video.cpy.mp4
	subprocess.run([
		'ffmpeg',
		'-y',
		'-i',
		'video.mp4',
		'-vf',
		f'scale=iw/{devicePixelRatio}:-2',
		'video.tmp.mp4',
	], check=True)
	subprocess.run([
		'mv',
		'video.tmp.mp4',
		'video.mp4',
	], check=True)
	os.chdir(cwd)

if __name__ == '__main__':
	for video in os.listdir(VIDEO_DIR):
		encode_video(video)
