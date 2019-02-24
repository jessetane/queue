var tape = require('tape')
var queue = require('../')

tape('start', function (t) {
  t.plan(4)

  var q = queue()
  function work (cb) {
    t.ok(q)
    cb()
  }

  q.on('start', function (job) {
    t.equals(job, work)
  })

  q.push(work)

  q.start(function () {
    t.ok(q)

    q.start(function () {
      t.ok(q)
    })
  })
})
