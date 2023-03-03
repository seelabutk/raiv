# RAIV Video Encoding and Hosting Server

## Requirements

* [Python 3.11](https://www.python.org/)
* [pipenv](https://pipenv.pypa.io/en/latest/)

## Create a virtual environment
```
cd /this/directory
pipenv --python /path/to/python3.11
```

## Build the server
```
pipenv sync -d
```

## Build the front-end
```
cd nuxt
yarn install
yarn build
```

## Run the server
```
pipenv run uvicorn src.main:app --reload --port PORT
```
