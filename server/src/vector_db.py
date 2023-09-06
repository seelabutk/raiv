import os
import cv2
import chromadb
import subprocess
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
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
	os.makedirs(path, exist_ok=True)
 
	# get the chroma client
	client = chromadb.PersistentClient(path=path)

	# get or create the collection
	collection = client.get_or_create_collection(collection_name)

	return collection


def populate_vec_db(video_dir, collection_name="raiv"):
	# get list of video directories
	video_dirs = [
		name
		for name in os.listdir(video_dir)
		if os.path.isdir(os.path.join(video_dir, name))
	]

	# get list of video fns
	video_fns = [
		os.path.join(video_dir, name, "video.mp4")
		for name in video_dirs
		if os.path.exists(os.path.join(video_dir, name, "video.mp4"))
	]
	
	add_videos_to_vec_db(video_dir, video_dirs, video_fns, collection_name=collection_name)


def add_videos_to_vec_db(video_dir, video_dirs, video_fns, collection_name="raiv"):
	# get the collection
	collection = get_vec_db(video_dir, collection_name)
 
    # get the embedder model
	options = get_embedder_options(video_dir)
	with vision.ImageEmbedder.create_from_options(options) as embedder:
		# iterate over videos
		for id, video_fn in zip(video_dirs, video_fns):
			video = read_video(video_fn)
			# for each frame, get embedding and add to collection
			for frame_no, frame in enumerate(video):
				# generate the embedding
				embedding = get_embedding(embedder, frame)
				# add the embedding to the collection
				collection.add(
					embeddings=embedding.tolist(),
					metadatas={
						"video_id": id,
						"frame_no": frame_no,
					},
					ids=f'{id}-{frame_no}',
				)

def query_vec_db(video_dir, query_image, collection_name="raiv", n_results=2):
	# get the collection
	collection = get_vec_db(video_dir, collection_name)

	# get the embedder model
	options = get_embedder_options(video_dir)
	with vision.ImageEmbedder.create_from_options(options) as embedder:
		# get the embedding of the query image
		query_embedding = get_embedding(embedder, query_image)
		# query the collection
		results = collection.query(
			query_embeddings=query_embedding.tolist(),
			n_results=n_results,
		)
	return results


def get_embedder_options(video_dir, model_asset_name="embedder.tflite"):
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


def get_embedder_model(video_dir, model_asset_name="embedder.tflite"):
	model_asset_path = os.path.join(video_dir, model_asset_name)
	if not os.path.exists(model_asset_path):
		subprocess.run([
			"wget",
			"-O",
			model_asset_path,
			"-q",
			"https://storage.googleapis.com/mediapipe-models/image_embedder/mobilenet_v3_small/float32/1/mobilenet_v3_small.tflite"
		], check=True)


def get_embedding(embedder, frame):
	image_tensor = mp.Image(
		image_format=mp.ImageFormat.SRGB, data=frame.astype(np.uint8))
	embedding = embedder.embed(image_tensor)
	return embedding.embeddings[0].embedding


def image_from_bin(bin):
	image = np.frombuffer(bin, dtype=np.uint8)
	image = cv2.imdecode(image, flags=1)
	return image
