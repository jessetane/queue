#!/usr/bin/env node

/*
 *  example.js
 *
 */

var Queue = require('..');

var q = new Queue({
  timeout: 100,
  concurrency: 100
});

var results = [];


// listen for events

q.on('processed', function(job) {
  console.log('job finished processing:', job.toString().replace(/\n/g, ''));
});

q.on('drain', function() {
  console.log('all done:', results);
});


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

q.on('timeout', function(job, next) {
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
