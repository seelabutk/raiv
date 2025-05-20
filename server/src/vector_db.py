import os
import cv2
import json
import chromadb
import subprocess
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from collections import defaultdict
from mediapipe.tasks.python import vision


def read_video(path):
	cap = cv2.VideoCapture(path)
	n_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
	height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
	width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
	frames = np.zeros((n_frames, height, width, 3), dtype=np.uint8)
	i = 0
	while True:
		ret, frame = cap.read()
		if not ret:
			break
		frames[i] = frame
		i += 1

	return frames[:, :, :, ::-1]


def get_vec_db(video_dir, collection_name="raiv"):
	""" Get or create the chrome collection. """
	path = os.path.join(video_dir, 'embeddings')

	# get the chroma client
	client = chromadb.PersistentClient(path=path)

	# get or create the collection
	collection = client.get_or_create_collection(
		name=collection_name,
		metadata={
			"hnsw:space": "cosine",
			"hnsw:M": 50,					#The maximum number of connections per node in the graph.
			"hnsw:search_ef": 150,			#The size of the dynamic list for the nearest neighbors during the search process.
			"hnsw:construction_ef": 250 	#The size of the dynamic list for the nearest neighbors during the graph construction.
		}
	)
	return collection


def delete_id_vec_db(video_dir, id, collection_name="raiv"):
	collection = get_vec_db(video_dir, collection_name)
	collection.delete(
		where={
			"video_id": id,
		},
	)


def populate_text_vec_db(video_dir, collection_name="raiv"):
	# get list of video directories
	video_dirs = [
		name
		for name in os.listdir(video_dir)
		if os.path.isdir(os.path.join(video_dir, name)) and name != "embeddings"
	]

	# create dictionary of api keys and their video ids
	video_ids = defaultdict(list)
	for name in video_dirs:
		for vid_id in os.listdir(os.path.join(video_dir, name)):
			if os.path.isdir(os.path.join(video_dir, name, vid_id)):
				video_ids[name].append(vid_id)

	# get list of action map fns
	video_fns = {}
	for name, vid_id in video_ids.items():
		for id in vid_id:
			if os.path.exists(os.path.join(video_dir, name, id, "action_map.json")):
				video_fns[id] = os.path.join(video_dir, name, id, "action_map.json")

	add_text_to_vec_db(video_dir, video_dirs, video_fns,
					   collection_name=collection_name)

def add_text_to_vec_db(video_dir, video_dirs, video_fns, collection_name="raiv"):
	# get the collection
	collection = get_vec_db(video_dir, collection_name)

	if isinstance(video_fns, dict):
		for id in video_fns:
			with open(video_fns[id], 'r') as f:
				action_map = json.load(f)

			def dfs(action):
				# add the tags to the collection
				document = action.get('tags', '')
				frame_no = action.get('position', 0)
				api_key = video_fns[id].split('/')[6]
				collection.upsert(
		 			documents=document,
					metadatas={
						"api_key": api_key,
						"video_id": id,
						"frame_no": frame_no,
					},
					ids=f'{id}-{frame_no}',
				)
				for child in action.get('children', []): 
					dfs(child)
			dfs(action_map)
	else:
		for id, video_fn in zip(video_dirs, video_fns):
			with open(video_fn, 'r') as f:
				action_map = json.load(f)
			def dfs(action):
				# add the tags to the collection
				document = action.get('tags', '')
				frame_no = action.get('position', 0)
				api_key = video_fn.split('/')[6]
				collection.upsert(
					documents=document,
					metadatas={
						"api_key": api_key,
						"video_id": id,
						"frame_no": frame_no,
					},
					ids=f'{id}-{frame_no}',
				)
				for child in action.get('children', []):
					dfs(child)
			dfs(action_map)
	

def query_text_vec_db(video_dir, query_text, api_key, collection_name="raiv", n_results=2):
	# get the collection
	collection = get_vec_db(video_dir, collection_name)
	# query the collection
	results = collection.query(
		query_texts=query_text,
		n_results=n_results,
		where={"api_key": api_key}
		#where={"$and": [{"api_key": api_key}, {"video_id": ""}]}

	)
	return results


def populate_image_vec_db(video_dir, collection_name="raiv"):
	# get list of video directories
	video_dirs = [
		name
		for name in os.listdir(video_dir)
		if os.path.isdir(os.path.join(video_dir, name)) and name != "embeddings"
	]

	# create dictionary of api keys and their video ids
	video_ids = defaultdict(list)
	for name in video_dirs:
		for vid_id in os.listdir(os.path.join(video_dir, name)):
			if os.path.isdir(os.path.join(video_dir, name, vid_id)):
				video_ids[name].append(vid_id)

	# get list of video fns
	video_fns = {}
	for name, vid_id in video_ids.items():
		for id in vid_id:
			if os.path.exists(os.path.join(video_dir, name, id, "video.mp4")):
				video_fns[id] = os.path.join(video_dir, name, id, "video.mp4")

	add_videos_to_vec_db(video_dir, video_dirs, video_fns,
						 collection_name=collection_name)


def add_videos_to_vec_db(video_dir, video_dirs, video_fns, collection_name="raiv"):
	# get the collection
	collection = get_vec_db(video_dir, collection_name)

	# get the embedder model
	options = get_image_embedder_options(video_dir)
	with vision.ImageEmbedder.create_from_options(options) as embedder:
		if isinstance(video_fns, dict):
			for id in video_fns:
				video = read_video(video_fns[id])
				# for each frame, get embedding and add to collection
				for frame_no, frame in enumerate(video):
					# generate the embedding
					embedding = get_image_embedding(embedder, frame)
					# add the embedding to the collection
					api_key = video_fns[id].split('/')[6]
					collection.upsert(
						embeddings=embedding.tolist(),
						metadatas={
							"api_key": api_key,
							"video_id": id,
							"frame_no": frame_no,
						},
						ids=f'{id}-{frame_no}',
					)
		else:
			# iterate over videos
			for id, video_fn in zip(video_dirs, video_fns):
				video = read_video(video_fn)
				# for each frame, get embedding and add to collection
				for frame_no, frame in enumerate(video):
					# generate the embedding
					embedding = get_image_embedding(embedder, frame)
					# add the embedding to the collection
					api_key = video_fn.split('/')[6]
					collection.upsert(
						embeddings=embedding.tolist(),
						metadatas={
							"api_key": api_key,
							"video_id": id,
							"frame_no": frame_no,
						},
						ids=f'{id}-{frame_no}',
					)
		


def query_image_vec_db(video_dir, query_image, api_key, collection_name="raiv", n_results=2):
	# get the collection
	collection = get_vec_db(video_dir, collection_name)

	# get the embedder model
	options = get_image_embedder_options(video_dir)
	with vision.ImageEmbedder.create_from_options(options) as embedder:
		# get the embedding of the query image
		query_embedding = get_image_embedding(embedder, query_image)
		# query the collection
		results = collection.query(
			query_embeddings=query_embedding.tolist(),
			n_results=n_results,
			where={"api_key": api_key},
		)
	return results


def get_image_embedder_options(video_dir, model_asset_name="embedder.tflite"):
	# Create options for Image Embedder
	model_asset_path = os.path.join(video_dir, model_asset_name)

	base_options = python.BaseOptions(
		model_asset_path=model_asset_path,
	)
	l2_normalize = True  # @param {type:"boolean"}
	quantize = True  # @param {type:"boolean"}
	options = vision.ImageEmbedderOptions(
		base_options=base_options, l2_normalize=l2_normalize, quantize=quantize)
	return options


def get_image_embedding(embedder, frame):
	image_tensor = mp.Image(
		image_format=mp.ImageFormat.SRGB, data=frame.astype(np.uint8))
	embedding = embedder.embed(image_tensor)
	return embedding.embeddings[0].embedding


def image_from_bin(bin):
	image = np.frombuffer(bin, dtype=np.uint8)
	image = cv2.imdecode(image, flags=1)
	return image
