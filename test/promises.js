var tape = require('tape')
var queue = require('../')

tape('promises', function (t) {
  t.plan(4)

  var actual = []
  var q = queue({ concurrency: 1 })

  q.on('end', function () {
    var expected = [ 'one', 'two', 'three' ]
    t.equal(actual.length, expected.length)

    for (var i in actual) {
      var a = actual[i]
      var e = expected[i]
      t.equal(a, e)
    }
  })

  q.push(function () {
    return new Promise(function (resolve, reject) {
      actual.push('three')
      resolve()
    })
  })

  q.unshift(function () {
    return new Promise(function (resolve, reject) {
      actual.push('one')
      resolve()
    })
  })

  q.splice(1, 0, function (cb) {
    return new Promise(function (resolve, reject) {
      actual.push('two')
      resolve()
    })
  })

  q.start()
})
