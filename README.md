```
  ____  _     _____ _     _____
 /  _ \/ \ /\/  __// \ /\/  __/
 | / \|| | |||  \  | | |||  \  
 | \_\|| \_/||  /_ | \_/||  /_ 
 \____\\____/\____\\____/\____\

```
An async job queue with adjustable concurrency.

## Why
Wanted something more flexible than [async](https://github.com/caolan/async#queue)'s queue.

## How
The module exports a class named `Queue` that implements most of the Array api. Pass async functions (ones that accept a callback) to an instance's `push()` method. Processing begins automatically on `process.nextTick()`.

## Install
`npm install queue`

## Properties
* `concurrency` maximum number of jobs that the queue should process concurrently - the default is 1  
* `timeout` milliseconds to wait for a job to execute its callback  

## Methods
* `push(job)` add a job to the queue  

## Events
* `'processed'` when jobs finish  
* `'timeout'` when `queue.timeout` milliseconds have elapsed and a job has not executed its callback  
* `'drain'` when the queue finishes processing all its jobs  

## Usage
```javascript
var Queue = require('queue');

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


// add jobs using familiar Array api

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
})

q.push(function(cb) {
  setTimeout(function() {
    console.log('slow job finished');
    cb();
  }, 200);
});

q.push(function(cb) {
  console.log('forgot to execute callback');
});
```

## Note
Version 1.0 introduces api changes and is NOT backwards compatible with 0.0.2

## License
[WTFPL](http://www.wtfpl.net/txt/copying/)
