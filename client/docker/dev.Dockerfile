FROM ubuntu:jammy

RUN apt-get update --fix-missing && apt-get install -y --fix-missing build-essential
RUN apt update && apt full-upgrade -y && apt install -y curl 

ENV NODE_VERSION=18.15.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="$NVM_DIR/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

COPY . /opt/run/client
RUN npm install --global yarn
WORKDIR /opt/run/client
RUN yarn install --frozen-lockfile

CMD ["yarn", "build-watch"]