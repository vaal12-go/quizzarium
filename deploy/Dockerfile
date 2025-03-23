# FROM node:lts-bookworm
FROM node@sha256:c7fd844945a76eeaa83cb372e4d289b4a30b478a1c80e16c685b62c54156285b
# Link to image: https://hub.docker.com/layers/library/node/lts-bookworm/images/sha256-0d6c855cacc3e167d82d74e4e1cbb62082a12bba57cb5e99325a4c6680fae79a

LABEL version="0.1"
LABEL description="Docker image for node development (Node.js v22.14.0 on bookworm)"

RUN mkdir /node-app

COPY ./package.json  /node-app/package.json
COPY ./package-lock.json  /node-app/package-lock.json

WORKDIR /node-app

RUN npm install

COPY ./routes /node-app/routes
COPY ./server /node-app/server
COPY ./static /node-app/static



# RUN rm -r /node-app/node_modules
# RUN npm install





CMD ["sh"]
# node server.js

# Build (to be run from root dir)
#   docker buildx build -t node-dev7 -f ./deploy/Dockerfile .


# Run
#   docker run --name node-dev-feb25 -it --rm -p 3000:3000 --entrypoint sh node-dev7