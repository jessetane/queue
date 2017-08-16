var tape = require('tape')
var queue = require('../')

tape('results', function (t) {
  t.plan(2)

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

  q.start(function (err, results) {
    t.error(err)
    t.deepEqual(results, [
      ['string'],
      [42],
      [3, 2, 1],
      []
    ])
  })
})
