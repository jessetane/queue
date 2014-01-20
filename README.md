```
   ____ ___  _____  __  _____ 
  / __ `/ / / / _ \/ / / / _ \
 / /_/ / /_/ /  __/ /_/ /  __/
 \__, /\__,_/\___/\__,_/\___/ 
   /_/                        
```
async job queue with adjustable concurrency

[![browser support](http://ci.testling.com/jessetane/queue.png)](http://ci.testling.com/jessetane/queue)

## why
wanted something more flexible than [async](https://github.com/caolan/async#queue)'s queue

## how
the module exports a class `Queue` that implements most of the `Array` api. pass async functions (ones that accept a callback) to an instance's additive array methods. processing begins when you call `q.start()`

## api
* `start()`  
* `end([err])` if you pass a `err` it will be available to 'end' event handlers when triggered

inherited from `Array`:
* `push(element1, ..., elementN)`  
* `unshift(element1, ..., elementN)`  
* `splice(index , howMany[, element1[, ...[, elementN]]])`  
* `pop()`  
* `shift()`  
* `slice(begin[, end])`  
* `reverse()`  
* `indexOf(searchElement[, fromIndex])`  
* `lastIndexOf(searchElement[, fromIndex])`  

## properties
* `concurrency` maximum number of jobs that the queue should process concurrently - the default is 1  
* `timeout` milliseconds to wait for a job to execute its callback  
* `length` jobs pending + jobs to process (readonly)

## events
* `q.emit('success', result, job)` after a job executes its callback  
* `q.emit('error', err, job)` after a job passes an error to its callback  
* `q.emit('timeout', continue, job)` after `q.timeout` milliseconds have elapsed and a job has not executed its callback  
* `q.emit('end'[, err])` after all jobs have been processed

## download
`npm install queue`  

## tests
`node test`

## example
`node example` runs this:
```javascript
var queue = require('queue');

var q = queue({
  timeout: 100,
  concurrency: 100
});

var results = [];


// listen for events

q.on('success', function(result, job) {
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

q.start();
```

## note
version 2.0 introduces api changes and is not backwards compatible with 1.0

## license
WTFPL
