# A Docker based MaxMind Geo IP lookup server for internal use

This image depends on the [pk4media/maxmind-geo-db](https://github.com/pk4media/maxmind-geo-db) Docker image. This project is intended for use by companies with a [MaxMind](http://maxmind.com/) Geo DB license and does not ship with a copy of any MaxMind databases.

This project uses the [maxmind-db-reader](https://github.com/PaddeK/node-maxmind-db) node.js project to load and lookup IP geolocation data for each request.

## Usage

This server takes a single IP address as part of the request path (http://<my-server>/127.0.0.1) and responds with a JSON blob representing the Geo data for the IP address in question.
