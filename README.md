```
   ____  __  _____  __  _____ 
  / __ `/ / / / _ \/ / / / _ \
 / /_/ / /_/ /  __/ /_/ /  __/
 \__, /\__,_/\___/\__,_/\___/ 
   /_/                        
```
async job queue with adjustable concurrency.

[![browser support](http://ci.testling.com/jessetane/queue.png)](http://ci.testling.com/jessetane/queue)

## why
[async](https://github.com/caolan/async) is a big libray offering various approaches to dealing with asynchrony; `queue` is a small library offering a single, flexible abstraction.

## how
this module exports a class `Queue` that implements most of the `Array` api. pass async functions (ones that accept a callback) to an instance's additive array methods. processing begins when you call `q.start()`

## install
`npm install queue`  

## test
`npm test`  
`npm run test-browser`

## example
`npm run example`
``` javascript
var queue = require('queue');

var q = queue();
var results = [];

// add jobs using the Array API

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
```

## require
#### `var queue = require('queue')`

## constructor
#### `var q = queue([opts])`
where `opts` may contain inital values for:
* `q.concurrency`
* `q.timeout`

## instance methods
#### `q.start([cb])`
cb, if passed will be called when the queue empties

#### `q.stop()`
stops the queue. can be resumed with `q.start()`

#### `q.end([err])`
stop and empty the queue immediately

## instance methods mixed in from `Array`
Mozilla has docs on how these methods work [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).
#### `q.push(element1, ..., elementN)`  
#### `q.unshift(element1, ..., elementN)`  
#### `q.splice(index , howMany[, element1[, ...[, elementN]]])`  
#### `q.pop()`  
#### `q.shift()`  
#### `q.slice(begin[, end])`  
#### `q.reverse()`  
#### `q.indexOf(searchElement[, fromIndex])`  
#### `q.lastIndexOf(searchElement[, fromIndex])`  

## properties
#### `q.concurrency`
max number of jobs the queue should process concurrently, defaults to `Infinity`

#### `q.timeout`
milliseconds to wait for a job to execute its callback

#### `q.length`
jobs pending + jobs to process (readonly)

## events

#### `q.emit('success', result, job)`
after a job executes its callback

#### `q.emit('error', err, job)`
after a job passes an error to its callback

#### `q.emit('timeout', continue, job)`
after `q.timeout` milliseconds have elapsed and a job has not executed its callback

#### `q.emit('end'[, err])`
after all jobs have been processed

## changelog
* version 3.0 
  * changes the default concurrency to `Infinity`
  * allow `q.start()` to accept an optional callback executed on `q.emit('end')`
* version 2.0 introduces api changes and is not backwards compatible with 1.0

## license
WTFPL
