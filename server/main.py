# import os

from fastapi import FastAPI
# from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse
from pydantic import BaseModel


class Frame(BaseModel):
	frame: str
	position: int
	video: str


class Video(BaseModel):
	name: str


app = FastAPI()
app.add_middleware(
	CORSMiddleware,
	allow_headers=['*'],
	allow_methods=['*'],
	allow_origins=['*']
)
# TODO: CORS generally needs to be available since this server is going to be
# public, but this needs more thought along with authentication


@app.post('/frame/')
async def frame__post(frame: Frame):
	print(frame)
	return 'Frame Posted'


@app.post('/video/')
async def video__post(video: Video):
	print(video)
	return 'Video Posted'

# TODO: pull from below as necessary
# pylint: disable=pointless-string-statement
"""
@app.get('/preview/{file}')
async def preview__get__detail(file):
	return FileResponse(
		os.path.join(os.getcwd(), 'data', 'rva', file, 'first_frame.png')
	)


@app.get('/rva')
async def rva__get__list():
	rva_list = os.listdir(os.path.join(os.getcwd(), 'data', 'rva'))

	objects = []
	for rva in rva_list:
		if os.path.isdir(os.path.join(os.getcwd(), 'data', 'rva', rva)):
			objects.append({
				'name': rva,
				'preview': f'/preview/{rva}',
			})

	return objects


@app.get('/rva/{file}')
async def rva__get__detail(file):
	return FileResponse(os.path.join(os.getcwd(), 'data', 'rva', file))


@app.get('/{path:path}')
async def nuxt(path):
	full_path = os.path.join(os.getcwd(), 'nuxt', 'dist', path)
	if os.path.isdir(full_path):
		full_path = os.path.join(full_path, 'index.html')

	if not os.path.isfile(full_path):
		raise HTTPException(status_code=404, detail='Page not found')

	return FileResponse(full_path)
"""
