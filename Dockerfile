FROM resin/raspberry-pi-alpine-node:7-slim

LABEL maintainer "thom.nocon@gmail.com"

WORKDIR dist/device-switch

COPY lib lib
COPY node_modules node_modules

CMD ["node", "lib/index.js"]