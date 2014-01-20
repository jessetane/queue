```
  ____  _     _____ _     _____
 /  _ \/ \ /\/  __// \ /\/  __/
 | / \|| | |||  \  | | |||  \  
 | \_\|| \_/||  /_ | \_/||  /_ 
 \____\\____/\____\\____/\____\

```
async job queue with adjustable concurrency

[![browser support](http://ci.testling.com/jessetane/queue.png)](http://ci.testling.com/jessetane/queue)

## why
wanted something more flexible than [async](https://github.com/caolan/async#queue)'s queue

## how
the module exports a class `Queue` that implements most of the `Array` api. pass async functions (ones that accept a callback) to an instance's additive array methods. processing begins when you call `q.start()`

## api
* `start()`  
* `stop()`  

inherited from `Array`:
* `push()`  
* `unshift()`  
* `splice()`  
* `pop()`  
* `shift()`  
* `slice()`  
* `reverse()`  
* `indexOf()`  
* `lastIndexOf()`  

## properties
* `concurrency` maximum number of jobs that the queue should process concurrently - the default is 1  
* `timeout` milliseconds to wait for a job to execute its callback  
* `length` jobs pending + jobs to process (readonly)

## events
* `q.emit('didProcessJob', job)` when jobs finish  
* `q.emit('timeout', job, continue)` when `q.timeout` milliseconds have elapsed and a job has not executed its callback  
* `q.emit('error', err, job)` when a job passes an error to its callback  
* `q.emit('end', q)` when a queue finishes processing all its jobs  

## download
`npm install queue`  

## test
`node test`  

## usage
```javascript
var Queue = require('queue');

var q = new Queue({
  timeout: 100,
  concurrency: 100
});

var results = [];


// listen for events

q.on('didProcessJob', function(job) {
  console.log('job finished processing:', job.toString().replace(/\n/g, ''));
});

q.on('end', function() {
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

q.start();
```

## note
version 2.0 introduces api changes and is not backwards compatible with 1.0

## license
WTFPL
