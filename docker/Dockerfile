FROM node:latest

RUN mkdir /src
RUN mkdir /uploads
RUN mkdir /var/logs
RUN mkdir /var/logs/fileshare
RUN touch /var/logs/fileshare/app.log
RUN mkdir /tmp/fileshare

ENV PORT=3000
ENV DB_USER={postgres_username}
ENV DB_PASS={postgres_password}
ENV DB=fileshare
ENV DB_HOST={postgres_ip}
ENV DB_PORT={postgres_port}
ENV SECRET=mysupersecret
ENV UPLOAD=/uploads
ENV TMP=/tmp/fileshare
ENV LOG_FILE=/var/logs/fileshare/app.log

WORKDIR /src
COPY ../package.json .
RUN npm install
COPY ../ /src
EXPOSE 3000
CMD ["npm","start"]