var queue = require('../');

var q = queue();
var results = [];

// add jobs using the familiar Array API

q.push(function(cb) {
  results.push('two');
  cb();
});

q.push(
  function(cb) {
    results.push('four');
    cb();
  },
  function(cb) {
    results.push('five');
    cb();
  }
);

q.unshift(function(cb) {
  results.push('one');
  cb();
});

q.splice(2, 0, function(cb) {
  results.push('three');
  cb();
});

// use the timeout feature to deal with jobs that 
// take too long or forget to execute a callback

q.timeout = 100;

q.on('timeout', function(next, job) {
  console.log('job timed out:', job.toString().replace(/\n/g, ''));
  next();
});

q.push(function(cb) {
  setTimeout(function() {
    console.log('slow job finished');
    cb();
  }, 200);
});

q.push(function(cb) {
  console.log('forgot to execute callback');
});

// get notified when jobs complete

q.on('success', function(result, job) {
  console.log('job finished processing:', job.toString().replace(/\n/g, ''));
});

// begin processing, get notified on end / failure

q.start(function(err) {
  console.log('all done:', results);
});
