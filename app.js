'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var mmdbreader = require('maxmind-db-reader');
var filewatcher = require('filewatcher');

var watcher = filewatcher({
  persistent: false
});

console.log(process.env.GEO_DATABASE);
var geodb = mmdbreader.openSync(process.env.GEO_DATABASE);

watcher.add(process.env.GEO_DATABASE);
watcher.on('change', function(file, stat) {
  console.log('Geo database modified:', file);
  geodb = mmdbreader.openSync(process.env.GEO_DATABASE);
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
