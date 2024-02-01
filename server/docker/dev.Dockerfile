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

RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
RUN python3.11 get-pip.py
RUN pip install pipenv
RUN pipenv --python /usr/bin/python3.11
COPY Pipfile /opt/run/server/Pipfile
COPY Pipfile.lock /opt/run/server/Pipfile.lock
COPY requirements.txt /opt/run/server/requirements.txt

WORKDIR /opt/run/server
RUN pipenv sync -d
RUN pipenv run spacy download en_core_web_sm

COPY policy.xml /etc/ImageMagick-6/policy.xml
COPY src /opt/run/server/src/
COPY entrypoint.sh /opt/run/server/entrypoint.sh
RUN /opt/run/server/entrypoint.sh

CMD ["pipenv", "run", "uvicorn", "src.main:app", "--reload", "--host", "0.0.0.0", "--port", "9000"]
#CMD ["pipenv", "run", "gunicorn", "src.main:app", "--reload", "--workers", "2", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:9000"]