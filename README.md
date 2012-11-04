```
  ____  _     _____ _     _____
 /  _ \/ \ /\/  __// \ /\/  __/
 | / \|| | |||  \  | | |||  \  
 | \_\|| \_/||  /_ | \_/||  /_ 
 \____\\____/\____\\____/\____\

```
An async job queue with adjustable concurrency.

## Why
[async](https://github.com/caolan/async#queue)'s queue expects you to have one worker and many jobs. This queue simply expects a list of async functions, which is a bit more flexible - otherwise it's the same idea.

## How
The module exports a class named ```Queue```. Pass the desired concurrency to the constructor, or change it later via the ```concurrency``` property. Pass async functions (ones that accept a callback) to an instance's ```push()``` method. Processing begins automatically on ```process.nextTick()```.

## Install
```npm install queue```

## Properties
* ```concurrency``` maximum number of jobs that the queue should process concurrently - the default is 1

## Methods
* ```push(job, cb)``` add a job (and optional callback) to the queue  
* ```empty()``` remove any remaining jobs in the queue  
* ```run()``` force run the queue immediately  

## Events
* ```"advance"``` fires after any job finishes  
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
