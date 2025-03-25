# FROM node:lts-bookworm
FROM node@sha256:c7fd844945a76eeaa83cb372e4d289b4a30b478a1c80e16c685b62c54156285b
# Link to image: https://hub.docker.com/layers/library/node/lts-bookworm/images/sha256-0d6c855cacc3e167d82d74e4e1cbb62082a12bba57cb5e99325a4c6680fae79a

LABEL version="0.2_24Mar2025"
LABEL description="Docker image for node development (Node.js v22.14.0 on bookworm)"

RUN mkdir /node-app

COPY ./package.json  /node-app/package.json
COPY ./package-lock.json  /node-app/package-lock.json

WORKDIR /node-app

RUN npm install

COPY ./routes /node-app/routes
COPY ./server /node-app/server
COPY ./static /node-app/static


# CMD ["sh"]
CMD ["node", "./server/server.js"]
# node ./server/server.js

# Build (to be run from root dir)
#   docker buildx build -t node-dev7 -f ./deploy/Dockerfile .


# Run
#   docker run --name node-dev-feb25 -d -p 3000:3000 node-dev7

# With sh as entrypoint
#   docker run --name node-dev-feb25 -it --rm -p 3000:3000 --entrypoint sh node-dev7


#Export
# docker image save --output="node-dev7_24Mar2025.tar" node-dev7

# Unzip (.7z archive) on server
#    p7zip -d node-dev7_image_24Mar2025_2.7z

#Import
#  docker image load --input="node-dev7_24Mar2025.tar"