import os

import chromadb


if __name__ == '__main__':
	path = os.path.join(os.getcwd(), 'data', 'embeddings')
	os.makedirs(path, exist_ok=True)

	client = chromadb.PersistentClient(path=path)
	collection = client.create_collection('raiv-image')
	collection = client.create_collection('raiv-text')
