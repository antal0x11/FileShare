FROM node:alpine

RUN mkdir /src
RUN mkdir /src/config
RUN mkdir /src/lib
RUN mkdir /src/models
RUN mkdir /src/routes
RUN mkdir /src/routes/admin
RUN mkdir /src/static

RUN mkdir /uploads
RUN mkdir /var/logs
RUN mkdir /var/logs/fileshare
RUN touch /var/logs/fileshare/app.log
RUN mkdir /tmp/fileshare

ENV PORT=80
ENV DB_USER=postuser
ENV DB_PASS=password
ENV DB=fileshare
ENV DB_HOST=10.2.2.2
ENV DB_PORT=5432
ENV SECRET=mysupersecret
ENV UPLOAD=/uploads
ENV TMP=/tmp/fileshare
ENV LOG_FILE=/var/logs/fileshare/app.log

WORKDIR /src

COPY ./package.json .

RUN npm install

COPY ./config ./config
COPY ./lib ./lib
COPY ./models ./models
COPY ./routes ./routes
COPY ./static ./static
COPY ./index.js .

CMD ["npm","start"]
