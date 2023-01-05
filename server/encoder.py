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

		rmtree(path)
