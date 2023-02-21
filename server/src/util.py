from glob import glob
import os
from shutil import rmtree
import subprocess

VIDEO_DIR = os.path.join('..', os.getcwd(), 'videos')


def merge_frames(video_id):
	path = os.path.join(VIDEO_DIR, video_id, 'frames')
	if not os.path.exists(path):
		return

	index = 0
	while True:
		frame_pattern = str(index).zfill(5)
		frame_set = glob(os.path.join(path, f'{frame_pattern}_*.png'))
		print(frame_pattern, frame_set)
		if not frame_set:
			break

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
	cwd = os.getcwd()

	path = os.path.join(VIDEO_DIR, video_id, 'frames')
	if not os.path.exists(path):
		return

	os.chdir(path)
	subprocess.run([
		'ffmpeg',
		'-y',
		'-framerate',
		'30',
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


if __name__ == '__main__':
	for video in os.listdir(VIDEO_DIR):
		encode_video(video)
