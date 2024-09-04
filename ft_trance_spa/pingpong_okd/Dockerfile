FROM python:3.11.4


ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get -y install libpq-dev gcc 

COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install --upgrade pip
RUN pip install -r requirements.txt   
#--no-cache-dir 
COPY ./entrypoint.sh /usr/src/app/entrypoint.sh
# COPY . /usr/src/app/
ENTRYPOINT [ "/usr/src/app/entrypoint.sh" ]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]