```
   ____  __  _____  __  _____
  / __ `/ / / / _ \/ / / / _ \
 / /_/ / /_/ /  __/ /_/ /  __/
 \__, /\__,_/\___/\__,_/\___/
   /_/
```
Asynchronous function queue with adjustable concurrency.

[![npm](http://img.shields.io/npm/v/queue.svg?style=flat-square)](http://www.npmjs.org/queue)

This module exports a class `Queue` that implements most of the `Array` API. Pass async functions (ones that accept a callback or return a promise) to an instance's additive array methods. Processing begins when you call `q.start()`.

## Example
Do `npm run example` or `npm run dev` and open the example directory (and your console) to run the following program:
``` javascript
import Queue from 'queue'

const q = new Queue({ results: [] })

// add jobs using the familiar Array API
q.push(cb => {
  const result = 'two'
  cb(null, result)
})

q.push(
  cb => {
    const result = 'four'
    cb(null, result)
  },
  cb => {
    const result = 'five'
    cb(null, result)
  }
)

// jobs can accept a callback or return a promise
q.push(() => {
  return new Promise((resolve, reject) => {
    const result = 'one'
    resolve(result)
  })
})

q.unshift(cb => {
  const result = 'one'
  cb(null, result)
})

q.splice(2, 0, cb => {
  const result = 'three'
  cb(null, result)
})

// use the timeout feature to deal with jobs that
// take too long or forget to execute a callback
q.timeout = 100

q.addEventListener('timeout', e => {
  console.log('job timed out:', e.detail.job.toString().replace(/\n/g, ''))
  e.detail.next()
})

q.push(cb => {
  setTimeout(() => {
    console.log('slow job finished')
    cb()
  }, 200)
})

q.push(cb => {
  console.log('forgot to execute callback')
})

// jobs can also override the queue's timeout
// on a per-job basis
function extraSlowJob (cb) {
  setTimeout(() => {
    console.log('extra slow job finished')
    cb()
  }, 400)
}

extraSlowJob.timeout = 500
q.push(extraSlowJob)

// jobs can also opt-out of the timeout altogether
function superSlowJob (cb) {
  setTimeout(() => {
    console.log('super slow job finished')
    cb()
  }, 1000)
}

superSlowJob.timeout = null
q.push(superSlowJob)

// get notified when jobs complete
q.addEventListener('success', e => {
  console.log('job finished processing:', e.detail.toString().replace(/\n/g, ''))
  console.log('The result is:', e.detail.result)
})

// begin processing, get notified on end / failure
q.start(err => {
  if (err) throw err
  console.log('all done:', q.results)
})
```

## Install

```
npm install queue

yarn add queue
```

## Test

```
npm test

npm run dev // for testing in a browser, open test directory (and your console)
```

## API

### `const q = new Queue([opts])`
Constructor. `opts` may contain initial values for:
* `q.concurrency`
* `q.timeout`
* `q.autostart`
* `q.results`

## Instance methods
### `q.start([cb])`
Explicitly starts processing jobs and provides feedback to the caller when the queue empties or an error occurs. If cb is not passed a promise will be returned.

### `q.stop()`
Stops the queue. can be resumed with `q.start()`.

### `q.end([err])`
Stop and empty the queue immediately.

## Instance methods mixed in from `Array`
Mozilla has docs on how these methods work [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array). Note that `slice` does not copy the queue.
### `q.push(element1, ..., elementN)`
### `q.unshift(element1, ..., elementN)`
### `q.splice(index , howMany[, element1[, ...[, elementN]]])`
### `q.pop()`
### `q.shift()`
### `q.slice(begin[, end])`
### `q.reverse()`
### `q.indexOf(searchElement[, fromIndex])`
### `q.lastIndexOf(searchElement[, fromIndex])`

## Properties
### `q.concurrency`
Max number of jobs the queue should process concurrently, defaults to `Infinity`.

### `q.timeout`
Milliseconds to wait for a job to execute its callback. This can be overridden by specifying a `timeout` property on a per-job basis.

### `q.autostart`
Ensures the queue is always running if jobs are available. Useful in situations where you are using a queue only for concurrency control.

### `q.results`
An array to set job callback arguments on.

### `q.length`
Jobs pending + jobs to process (readonly).

## Events

### `q.dispatchEvent(new QueueEvent('start', { job }))`
Immediately before a job begins to execute.

### `q.dispatchEvent(new QueueEvent('success', { result: [...result], job }))`
After a job executes its callback.

### `q.dispatchEvent(new QueueEvent('error', { err, job }))`
After a job passes an error to its callback.

### `q.dispatchEvent(new QueueEvent('timeout', { next, job }))`
After `q.timeout` milliseconds have elapsed and a job has not executed its callback.

### `q.dispatchEvent(new QueueEvent('end', { err }))`
After all jobs have been processed

## Releases
The latest stable release is published to [npm](http://npmjs.org/queue). Abbreviated changelog below:
* [7.0](https://github.com/jessetane/queue/archive/7.0.0.tar.gz)
  * Modernized codebase, added new maintainer (@MaksimLavrenyuk)
* [6.0](https://github.com/jessetane/queue/archive/6.0.1.tar.gz)
  * Add `start` event before job begins (@joelgriffith)
  * Add `timeout` property on a job to override the queue's timeout (@joelgriffith)
* [5.0](https://github.com/jessetane/queue/archive/5.0.0.tar.gz)
  * Updated TypeScript bindings (@Codex-)
* [4.4](https://github.com/jessetane/queue/archive/4.4.0.tar.gz)
  * Add results feature
* [4.3](https://github.com/jessetane/queue/archive/4.3.0.tar.gz)
  * Add promise support (@kwolfy)
* [4.2](https://github.com/jessetane/queue/archive/4.2.0.tar.gz)
  * Unref timers on end
* [4.1](https://github.com/jessetane/queue/archive/4.1.0.tar.gz)
  * Add autostart feature
* [4.0](https://github.com/jessetane/queue/archive/4.0.0.tar.gz)
  * Change license to MIT
* [3.1.x](https://github.com/jessetane/queue/archive/3.0.6.tar.gz)
  * Add .npmignore
* [3.0.x](https://github.com/jessetane/queue/archive/3.0.6.tar.gz)
  * Change the default concurrency to `Infinity`
  * Allow `q.start()` to accept an optional callback executed on `q.emit('end')`
* [2.x](https://github.com/jessetane/queue/archive/2.2.0.tar.gz)
  * Major api changes / not backwards compatible with 1.x
* [1.x](https://github.com/jessetane/queue/archive/1.0.2.tar.gz)
  * Early prototype

## License
[MIT](https://github.com/jessetane/queue/blob/master/license.md)
