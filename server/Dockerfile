FROM ubuntu:jammy

RUN apt-get update --fix-missing && apt-get install -y --fix-missing build-essential
RUN apt update && apt full-upgrade -y && apt install -y \
  curl \
  wget \
  ffmpeg \
  imagemagick \
  software-properties-common 

RUN add-apt-repository ppa:deadsnakes/ppa -y
RUN apt update && DEBIAN_FRONTEND=noninteractive apt install -y \
  python3.11 python3.11-dev

ENV NODE_VERSION=18.15.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

COPY Pipfile /opt/run/Pipfile
COPY Pipfile.lock /opt/run/Pipfile.lock
COPY requirements.txt /opt/run/requirements.txt
COPY src /opt/run/src
COPY client /opt/run/client
COPY policy.xml /etc/ImageMagick-6/policy.xml

RUN npm install --global yarn
WORKDIR /opt/run/client
RUN yarn install --frozen-lockfile
RUN yarn build

WORKDIR /opt/run
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
RUN python3.11 get-pip.py
RUN pip install -r requirements.txt
RUN python3.11 -m spacy download en_core_web_sm
