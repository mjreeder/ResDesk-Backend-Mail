var Sails = require('sails'), sails;
var mongod = require('child_process').spawn('mongod');

before(function(done) {
  process.env.NODE_ENV = 'test';
  process.env.PORT = 1337;
  Sails.lift({
    // configuration for testing purposes
  }, function(err, s) {
    if (err) return done(err);
    sails = s;
    global.server = sails.hooks.http.app;
    // here you can load fixtures, etc.
    done(err, sails);
  });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
  mongod.kill('SIGINT');
});
