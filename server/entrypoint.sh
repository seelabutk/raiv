# Create the data directory if needed
mkdir -p /opt/run/data

# Volume-based lock to allow all workers to wait for embeddings before launching
while [ -d /opt/run/data/global_swarm_lock ]; do
	sleep 1
done
mkdir /opt/run/data/global_swarm_lock

# Pull model weights for tensorflow if needed
if [ ! -f /opt/run/data/embedder.tflite ]; then
	wget -O /opt/run/data/embedder.tflite https://storage.googleapis.com/mediapipe-models/image_embedder/mobilenet_v3_small/float32/1/mobilenet_v3_small.tflite
fi

# Create the chromadb embeddings if necessary
if [ ! -d /opt/run/data/embeddings ]; then
	pipenv run python src/create_embeddings.py
fi

# Release the lock
rm -r /opt/run/data/global_swarm_lock

# Start the server
pipenv run gunicorn src.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:80
