import os
from shutil import rmtree
import subprocess

VIDEO_DIR = os.path.join(os.getcwd(), 'videos')

for video in os.listdir(VIDEO_DIR):
	path = os.path.join(VIDEO_DIR, video, 'frames')
	if os.path.exists(path):
		os.chdir(path)
		subprocess.run([
			'ffmpeg',
			'-framerate',
			'30',
			'-pattern_type',
			'glob',
			'-i',
			'*.png',
			'-c:v',
			'libx264',
			'-pix_fmt',
			'yuv420p',
			'../video.mp4'
		], check=True)

		rmtree(path)
