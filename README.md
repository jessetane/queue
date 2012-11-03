```
 ____  _     _____ _     _____
/  _ \/ \ /\/  __// \ /\/  __/
| / \|| | |||  \  | | |||  \  
| \_\|| \_/||  /_ | \_/||  /_ 
\____\\____/\____\\____/\____\

```
An async function queue with adjustable concurrency.

## Why
[caolan/async](https://github.com/caolan/async#queue)'s queue expects you to use one worker and many data items. This one simply expects async functions, meaning your workers can be unique.

## API
The module exports a single EventEmitter subclass called ```Queue```. It can be instantiated with ```new``` and its constructor takes no arguments. If the ```push()``` method is called when the queue has no jobs in it, processing will begin automatically on ```process.nextTick()```.

#### Properties
```concurrency``` maximum number of jobs that the queue should process concurrently. default = 1

#### Methods
```push(job, cb)``` add a job (and an optional callback) to the queue
```empty()``` remove any remaining jobs in the queue
```run()``` force run the queue immediately

#### Events
```advance``` fires after a job finishes
```drain``` fires when the queue is empty

## Usage
```javascript
var Queue = require("queue");

var results = [];
var q = new Queue();

// add a drain handler
q.on("drain", function () {
  console.log("All done:", results);
});

// push individual functions
q.push(function (cb) {
  results.push("one");
  cb();
});

// push an arrays of functions
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
