# RAIV

## Requirements

* [Node.js](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/)
* [Python 3.11](https://www.python.org)
* [pipenv](https://pipenv.pypa.io/en/latest/)

## Browser extension setup

```
cd chrome_extension
yarn install --frozen-lockfile
```

## Server setup

```
cd server
pipenv --python /path/to/python3.11
pipenv sync -d

cd nuxt
yarn install --frozen-lockfile
```

## start.sh

Once the above commands have been run, `start.sh` will automatically
launch each of the necessary services to run RAIV in a separate tmux
window.
