#!/bin/sh

docker build -t quarks-web .

id=$(docker create quarks-web)
docker cp $id:/home/quark-web/src/assets/quarks.json ./src/assets/quarks.json
docker rm -v $id
