var tape = require('tape')
var queue = require('../')

tape('concurrent', function (t) {
  t.plan(7)

  var actual = []
  var q = queue()
  q.concurrency = 2

  q.push(function (cb) {
    setTimeout(function () {
      actual.push('four')
      cb()
    }, 20)
  })

  q.push(function (cb) {
    setTimeout(function () {
      actual.push('one')
      cb()
    }, 0)
  })

  q.push(function (cb) {
    setTimeout(function () {
      actual.push('two')
      cb()
    }, 0)
  })

  q.push(function (cb) {
    q.concurrency = 1
    setTimeout(function () {
      actual.push('three')
      cb()
    }, 10)
  })

  q.push(function (cb) {
    setTimeout(function () {
      actual.push('five')
      cb()
    }, 30)
  })

  q.push(function (cb) {
    setTimeout(function () {
      actual.push('six')
      cb()
    }, 0)
  })

  q.start(function () {
    var expected = [ 'one', 'two', 'three', 'four', 'five', 'six' ]
    t.equal(actual.length, expected.length)

    for (var i in actual) {
      var a = actual[i]
      var e = expected[i]
      t.equal(a, e)
    }
  })
})
