var tape = require('tape')
var queue = require('../')

tape('results', function (t) {
  t.plan(6)

  var i = 0
  var expected = [
    [42],
    [3, 2, 1],
    [],
    ['string']
  ]

  var q = queue({ results: [] })

  q.push(
    function (cb) {
      cb(null, 42)
    },
    function (cb) {
      cb(null, 3, 2, 1)
    },
    function (cb) {
      cb()
    }
  )

  q.unshift(function (cb) {
    setTimeout(function () {
      cb(null, 'string')
    }, 10)
  })

  q.on('success', function () {
    var results = Array.from(arguments).slice(1)
    t.deepEqual(results, expected[i++])
  })

  q.start(function (err, results) {
    t.error(err)
    expected.unshift(expected.pop())
    t.deepEqual(results, expected)
  })
})
