```
  ____  _     _____ _     _____
 /  _ \/ \ /\/  __// \ /\/  __/
 | / \|| | |||  \  | | |||  \  
 | \_\|| \_/||  /_ | \_/||  /_ 
 \____\\____/\____\\____/\____\

```
An async job queue with adjustable concurrency.

## Why
[async](https://github.com/caolan/async#queue)'s queue expects you to have one worker and many jobs. This queue simply expects a list of async functions, which is a bit easier for me to wrap my mind around.

## How
The module exports a class named ```Queue```. It can be instantiated with ```new``` and its constructor takes no arguments. If the ```push()``` method is called while the queue is empty, processing will begin automatically via ```process.nextTick()```.

## Properties
* ```concurrency``` maximum number of jobs that the queue should process concurrently. default = 1

## Methods
* ```push(job, cb)``` add a job (and optional callback) to the queue  
* ```empty()``` remove any remaining jobs in the queue  
* ```run()``` force run the queue immediately  

## Events
* ```"advance"``` fires after a job finishes  
* ```"drain"``` fires when the queue finishes processing all its jobs

## Usage
```javascript
var Queue = require("../queue");

var results = [];
var q = new Queue();

// add a drain handler
q.on("drain", function () {
  console.log("All done:", results);
});

// add individual functions
q.push(function (cb) {
  results.push("one");
  cb();
});

// add arrays of functions
q.push([
  function (cb) {
    results.push("two");
    cb();
  },
  function (cb) {
    results[2] = "three";
    cb();
  }
]);
```
