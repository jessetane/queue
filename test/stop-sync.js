var tape = require('tape')
var queue = require('../')

tape('stop-sync', function (t) {
  t.plan(2)

  var q = queue({ concurrency: 1 })
  var n = 0

  q.push(function (cb) {
    n++
    q.stop()
    cb()
  })

  q.push(function (cb) {
    n++
    cb()
  })

  q.start()

  setTimeout(function () {
    t.equal(q.length, 1)
    t.equal(n, 1)
  })
})
