# RAIV

## Requirements

* [Node.js](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/)
* [Python 3.11](https://www.python.org)
* [pipenv](https://pipenv.pypa.io/en/latest/)

## Browser extension setup

```
cd browser_extension
yarn install --frozen-lockfile

yarn build-watch
```

## Recording/playback server setup

```
cd server
pipenv --python /path/to/python3.11
pipenv sync -d

pipenv run uvicorn src.main:app --reload --port PORT
```

## Playback client setup

```
cd server/client
yarn install --frozen-lockfile

yarn build-watch
```

## start.sh

Alternatively, you can run `start.sh` which should initialize each
component of the project and run each one in a separate tmux window.
