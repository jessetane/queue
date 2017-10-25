var tape = require('tape')
var queue = require('../')

tape('concurrent', function (t) {
  t.plan(4)

  var actual = []
  var q = queue()

  q.push(function (cb) {
    setTimeout(function () {
      actual.push('one')
      cb()
    }, 0)
  })

  q.push(function (cb) {
    setTimeout(function () {
      actual.push('three')
      cb()
    }, 20)
  })

  q.push(function (cb) {
    setTimeout(function () {
      actual.push('two')
      cb()
    }, 10)
  })

  q.start(function () {
    var expected = [ 'one', 'two', 'three' ]
    t.equal(actual.length, expected.length)

    for (var i in actual) {
      var a = actual[i]
      var e = expected[i]
      t.equal(a, e)
    }
  })
})

tape('concurrent with changes', function (t) {
  t.plan(13)

  var actual = []
  var q = queue()
  q.concurrency = 2

  q.push(function (cb) {
    actual.push('one.start')
    setTimeout(function () {
      actual.push('one.end')
      cb()
    }, 20)
  })

  q.push(function (cb) {
    actual.push('two.start')
    setTimeout(function () {
      actual.push('two.end')
      cb()
    }, 0)
  })

  q.push(function (cb) {
    actual.push('three.start')
    setTimeout(function () {
      actual.push('three.end')
      cb()
    }, 0)
  })

  q.push(function (cb) {
    actual.push('four.start')
    q.concurrency = 1
    setTimeout(function () {
      actual.push('four.end')
      cb()
    }, 10)
  })

  q.push(function (cb) {
    actual.push('five.start')
    setTimeout(function () {
      actual.push('five.end')
      cb()
    }, 30)
  })

  q.push(function (cb) {
    actual.push('six.start')
    setTimeout(function () {
      actual.push('six.end')
      cb()
    }, 0)
  })

  q.start(function () {
    var expected = [
      'one.start',
      'two.start', 'two.end',
      'three.start', 'three.end',
      'four.start', 'four.end', // <-- concurrency dropped
      'one.end',
      'five.start', 'five.end',
      'six.start', 'six.end'
    ]
    t.equal(actual.length, expected.length)

    for (var i in actual) {
      var a = actual[i]
      var e = expected[i]
      t.equal(a, e)
    }
  })
})
