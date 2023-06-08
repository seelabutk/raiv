from fastapi.responses import StreamingResponse
from glob import glob
from shutil import rmtree
from io import BytesIO
import subprocess
import zipfile
import os


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
	stat = os.stat('../video.mp4')
	os.chdir(cwd)

	rmtree(path)
	return stat


def zipfiles(file_list):
	""" Zip a list of files and stream the resulting archive. """
	io = BytesIO()
	zip_sub_dir = "final_archive"
	zip_filename = "%s.zip" % zip_sub_dir
	with zipfile.ZipFile(io, mode='w', compression=zipfile.ZIP_DEFLATED) as zip:
		for fpath in file_list:
			zip.write(fpath, os.path.basename(fpath))
		#close zip
		zip.close()
	return StreamingResponse(
        iter([io.getvalue()]),
        media_type="application/x-zip-compressed",
        headers = { "Content-Disposition": f"attachment;filename={zip_filename}" }
    )

if __name__ == '__main__':
	for video in os.listdir(VIDEO_DIR):
		encode_video(video)
