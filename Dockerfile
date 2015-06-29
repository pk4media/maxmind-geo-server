FROM node:0.12-onbuild

ENV NODE_ENV=production
ENV MAXMIND_DIRECTORY=/data/maxmind
ENV GEO_DATABASE=GeoIP2-City.mmdb

EXPOSE 80
