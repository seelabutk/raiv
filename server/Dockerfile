FROM ubuntu:jammy

RUN apt update && apt full-upgrade && apt install -y \
  curl \
  software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa -y

RUN apt update && DEBIAN_FRONTEND=noninteractive apt install -y \
  python3.11

WORKDIR /opt/run
COPY main.py .

RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
RUN python3.11 get-pip.py
RUN pip install \
  fastapi \
  pydantic \
  uvicorn[standard]
