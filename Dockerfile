FROM node:14-bullseye AS builder

WORKDIR /home/quark-web

RUN apt-get update && \
    apt-get install --yes \
        build-essential \
        cmake \
        libjack-jackd2-dev \
        libsndfile1-dev \
        libfftw3-dev \
        libxt-dev \
        libavahi-client-dev \
        libudev-dev && \
    git clone --recurse-submodules --depth=1 --branch 3.12 https://github.com/SuperCollider/SuperCollider.git && \
    cd SuperCollider && mkdir -p build && cd build && \
    cmake \
        -DBUILD_TESTING=OFF \
        -DENABLE_TESTSUITE=OFF \
        -DINSTALL_HELP=OFF \
        -DNO_X11=OFF \
        -DSC_ABLETON_LINK=OFF \
        -DSC_ED=OFF \
        -DSC_EL=no \
        -DSC_IDE=OFF \
        -DSC_USE_QTWEBENGINE=OFF \
        -DSC_VIM=OFF \
        -DSUPERNOVA=OFF \
        -DSC_QT=OFF \
        -DCMAKE_INSTALL_PREFIX=/usr/local \
        .. && \
    make && \
    make install && \
    cd .. && \
    rm -rf SuperCollider && \
    rm -rf /var/lib/apt/lists/*

ADD package.json .
ADD package-lock.json .

RUN npm install

ADD . .

RUN mkdir -p /home/quark-web/repos

RUN node createJson.js

FROM node:14-alpine

WORKDIR /home/quark-web

ADD package.json .
ADD package-lock.json .

RUN npm install

ADD . .

COPY --from=builder /home/quark-web/src/assets/quarks.json /home/quark-web/src/assets/quarks.json

RUN npm run build

EXPOSE 8080

CMD [ "npm", "run", "serve" ]
