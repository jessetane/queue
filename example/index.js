import Queue from 'queue'

const q = new Queue({ results: [] })

// add jobs using the familiar Array API
q.push(function (cb) {
  const result = 'two'
  cb(null, result)
})

q.push(
  function (cb) {
    const result = 'four'
    cb(null, result)
  },
  function (cb) {
    const result = 'five'
    cb(null, result)
  }
)

// jobs can accept a callback or return a promise
q.push(function () {
  return new Promise(function (resolve, reject) {
    const result = 'one'
    resolve(result)
  })
})

q.unshift(function (cb) {
  const result = 'one'
  cb(null, result)
})

q.splice(2, 0, function (cb) {
  const result = 'three'
  cb(null, result)
})

// use the timeout feature to deal with jobs that
// take too long or forget to execute a callback
q.timeout = 100

q.addEventListener('timeout', function (e) {
  console.log('job timed out:', e.detail.job.toString().replace(/\n/g, ''))
  e.detail.next()
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

// jobs can also opt-out of the timeout altogether
function superSlowJob (cb) {
  setTimeout(function () {
    console.log('super slow job finished')
    cb()
  }, 1000)
}

superSlowJob.timeout = null
q.push(superSlowJob)

// get notified when jobs complete
q.addEventListener('success', function (e) {
  console.log('job finished processing:', e.detail.toString().replace(/\n/g, ''))
  console.log('The result is:', e.detail.result)
})

// begin processing, get notified on end / failure
q.start(function (err) {
  if (err) throw err
  console.log('all done:', q.results)
})
