import os

import chromadb

from vector_db import (
    get_vec_db,
	populate_image_vec_db,
	populate_text_vec_db,
)

if __name__ == '__main__':
	VIDEO_DIR = os.path.join(os.getcwd(), 'data')
	IMAGE_VEC_COLLECTION_NAME = "raiv-image"
	TEXT_VEC_COLLECTION_NAME = "raiv-text"

	os.makedirs(os.path.join(VIDEO_DIR, 'embeddings'), exist_ok=True)

	collection = get_vec_db(VIDEO_DIR, collection_name=IMAGE_VEC_COLLECTION_NAME)
	populate_image_vec_db(VIDEO_DIR, collection_name=IMAGE_VEC_COLLECTION_NAME)
 
	collection = get_vec_db(VIDEO_DIR, collection_name=TEXT_VEC_COLLECTION_NAME)
	populate_text_vec_db(VIDEO_DIR, collection_name=TEXT_VEC_COLLECTION_NAME)

