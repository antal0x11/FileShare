FROM node:latest
RUN mkdir /src
RUN mkdir /uploads
WORKDIR /src
COPY ../package.json .
RUN npm install
COPY ../ /src
EXPOSE 3000
CMD ["npm","start"]