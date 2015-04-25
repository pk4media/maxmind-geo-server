FROM pk4media/nodejs:latest

ENV MAXMIND_PRODUCT_KEYS GeoIP2-City
ENV MAXMIND_DIRECTORY /data
ENV GEO_DATABASE /data/GeoIP2-City.mmdb

RUN mkdir -p ${MAXMIND_DIRECTORY}
VOLUME ${MAXMIND_DIRECTORY}

COPY geoipupdate.sh /etc/my_init.d/10_geoipupdate.sh
RUN chmod +x /etc/my_init.d/10_geoipupdate.sh

RUN echo "39 13 * * 4 root /etc/my_init.d/10_geoipupdate.sh" >> /etc/crontab

COPY config/confd/ /etc/confd/
COPY config/maxmind-env.conf /etc/nginx/main.d/maxmind-env.conf

RUN add-apt-repository ppa:maxmind/ppa
RUN apt-get update && apt-get install geoipupdate

COPY . /home/app/webapp
