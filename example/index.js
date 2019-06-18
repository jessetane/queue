var queue = require('../')

var q = queue({ results: [] })

// add jobs using the familiar Array API
q.push(function (cb) {
  const result = 'two'
  cb(null, result)
})

q.push(
  function (cb) {
    cb(null, 'four')
  },
  function (cb) {
    cb(null, 'five')
  }
)

// jobs can accept a callback or return a promise
q.push(function () {
  return new Promise(function (resolve, reject) {
    resolve('six')
  })
})

q.unshift(function (cb) {
  cb(null, 'one')
})

q.splice(2, 0, function (cb) {
  cb(null, 'three')
})

// use the timeout feature to deal with jobs that
// take too long or forget to execute a callback
q.timeout = 100

q.on('timeout', function (next, job) {
  console.log('job timed out:', job.toString().replace(/\n/g, ''))
  next()
})

q.push(function (cb) {
  setTimeout(function () {
    console.log('slow job finished')
    cb()
  }, 200)
})

q.push(function (cb) {
  console.log('forgot to execute callback')
})

// jobs can also override the queue's timeout
// on a per-job basis
function extraSlowJob (cb) {
  setTimeout(function () {
    console.log('extra slow job finished')
    cb()
  }, 400)
}

extraSlowJob.timeout = 500
q.push(extraSlowJob)

// get notified when jobs complete
q.on('success', function (firstResult) {
  var args = Array.from(arguments)
  var job = args.pop()
  var results = args
  console.log('job successful, results:', results, 'source:', job.toString().replace(/\n/g, ''))
})

// begin processing, get notified on end / failure
q.start(function (err) {
  if (err) throw err
  console.log('all done:', q.results)
})
