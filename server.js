'use strict';

var pm2 = require('pm2');

pm2.connect(function(err) {
  pm2.start(
    'bin/www',
    {
      name: 'geolocation',
      watch: true,
      nodeArgs: ['--harmony'],
      instances: 0
    },
    function(err, proc) {
      if (err) throw new Error(err);

      pm2.list(function(err, processList) {
        console.log(processList);

        /*pm2.disconnect(function() {
          process.exit(0);
        });*/
      });
    }
  );
});
