var tape = require('tape')
var queue = require('../')

tape('timeout', function (t) {
  t.plan(4)

  var actual = []
  var q = queue({ timeout: 10 })

  q.on('timeout', function (next) {
    t.ok(q)
    next()
  })

  q.on('end', function () {
    var expected = [ 'two', 'three' ]
    t.equal(actual.length, expected.length)

    for (var i in actual) {
      var a = actual[i]
      var e = expected[i]
      t.equal(a, e)
    }
  })

  q.push(function (cb) {
    // forget to call cb
  })

  q.push(function (cb) {
    actual.push('two')
    cb()
  })

  q.push(function (cb) {
    actual.push('three')
    cb()
  })

  q.start()
})

tape('job timeout', function (t) {
  t.plan(2)

  var timeouts = 0
  var q = queue({ timeout: 5 })
  function willTimeout (cb) {
    setTimeout(cb, 8)
  }
  function wontTimeout (cb) {
    setTimeout(cb, 8)
  }

  wontTimeout.timeout = 10

  q.on('timeout', function (next) {
    t.ok(q)
    timeouts++
    next()
  })

  q.on('end', function () {
    t.equal(timeouts, 1)
  })

  q.push(willTimeout)
  q.push(wontTimeout)

  q.start()
})

tape('job-based opt-out of timeout', function (t) {
  t.plan(1)

  var timeouts = 0
  var q = queue({ timeout: 5 })
  function wontTimeout (cb) {
    setTimeout(cb, 8)
  }

  wontTimeout.timeout = undefined

  q.on('timeout', function (next) {
    t.fail('Job should not have timed-out')
    timeouts++
    next()
  })

  q.on('end', function () {
    t.equal(timeouts, 0)
  })

  q.push(wontTimeout)

  q.start()
})

tape('timeout auto-continue', function (t) {
  t.plan(3)

  var actual = []
  var q = queue({ timeout: 10 })

  q.on('end', function () {
    var expected = [ 'two', 'three' ]
    t.equal(actual.length, expected.length)

    for (var i in actual) {
      var a = actual[i]
      var e = expected[i]
      t.equal(a, e)
    }
  })

  q.push(function (cb) {
    // forget to call cb
  })

  q.push(function (cb) {
    actual.push('two')
    cb()
  })

  q.push(function (cb) {
    actual.push('three')
    cb()
  })

  q.start()
})

tape('unref timeouts', function (t) {
  t.plan(3)

  var q = queue({ timeout: 99999 })

  q.push(function (cb) {
    t.pass()
    // forget to call cb
  })

  q.start()

  q.stop()

  setTimeout(function () {
    t.equal(q.pending, 1)

    q.end()

    t.equal(q.pending, 0)
  }, 10)
})
