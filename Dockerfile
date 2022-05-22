FROM node:14-alpine

WORKDIR /home/quark-web

ADD package.json .
ADD package-lock.json .

RUN npm install

ADD . .

RUN npm build
