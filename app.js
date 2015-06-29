'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var mmdbreader = require('maxmind-db-reader');
var filewatcher = require('filewatcher');
var path = require('path');

var watcher = filewatcher({
  persistent: false
});

var geoDBFile = path.join(process.env.GEO_DB_ENV_MAXMIND_DIRECTORY || process.env.MAXMIND_DIRECTORY, process.env.GEO_DATABASE);
console.log(geoDBFile);
var geodb = mmdbreader.openSync(geoDBFile);

watcher.add(geoDBFile);
watcher.on('change', function(file, stat) {
  console.log('Geo database modified:', file);
  geodb = mmdbreader.openSync(geoDBFile);
});

var app = express();

app.use(logger('dev'));

app.use('/:ip', function(req, res, next) {
  try {
    geodb.getGeoData(req.params.ip, function(err, data) {
      if (err) {
        return next(err);
      }

      res.send(data);
    });
  } catch(ex) {
    res.send(ex);
  }
});

app.use('/', function(req, res, next) {
  try {
    res.set({
      'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': 'Fri, 01 Jan 1990 00:00:00 GMT'
    });

    geodb.getGeoData('23.243.25.120', function(err, data) {
      if (err) {
        res.status(500).send('Geo Database Error');
      }

      res.status(200).send('');
    });
  } catch(ex) {
    res.status(500).send('Geo Database Error');
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
