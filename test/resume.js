var tape = require('tape')
var queue = require('../')

tape('resume', function (t) {
  t.plan(16)

  var q = queue({ concurrency: 2 })

  var jobsToSet = 16

  while (jobsToSet--) {
    q.push(function (cb) {
      setTimeout(function () {
        t.ok(q)
        cb()
      }, 200)
    })
  }

  // start
  q.start()

  // and stop somewhere in the middle of queue
  setTimeout(function () {
    q.stop()
    q.start()
  }, 600)
})
