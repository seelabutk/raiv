FROM ubuntu:jammy

RUN apt update && apt full-upgrade -y && apt install -y \
  curl \
  ffmpeg \
  imagemagick \
  software-properties-common

RUN add-apt-repository ppa:deadsnakes/ppa -y
RUN apt update && DEBIAN_FRONTEND=noninteractive apt install -y \
  python3.11

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt install -y nodejs

COPY src /opt/run/src
COPY client /opt/run/client

RUN npm install --global yarn
WORKDIR /opt/run/client
RUN yarn install --frozen-lockfile
RUN yarn build

WORKDIR /opt/run
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
RUN python3.11 get-pip.py
RUN pip install \
  fastapi \
  gunicorn \
  pydantic \
  uvicorn[standard]
