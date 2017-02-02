var tape = require('tape')
var queue = require('../')

tape('pop sync', function (t) {
  t.plan(2)

  var q = queue()
  var results = []

  q.push(function (cb) {
    results.push(1)
    cb()
  })

  q.push(function (cb) {
    results.push(2)
    cb()
  })

  q.pop()

  q.start(function (err) {
    t.error(err)
    t.deepEqual(results, [ 1 ])
  })
})

tape('pop async', function (t) {
  t.plan(2)

  var q = queue({ concurrency: 1 })
  var results = []

  q.push(function (cb) {
    results.push(1)
    setTimeout(cb, 100)
  })

  q.push(function (cb) {
    results.push(2)
    cb()
  })

  q.start(function (err) {
    t.error(err)
    t.deepEqual(results, [ 1 ])
  })

  q.pop()
})

tape('shift sync', function (t) {
  t.plan(2)

  var q = queue()
  var results = []

  q.push(function (cb) {
    results.push(1)
    cb()
  })

  q.push(function (cb) {
    results.push(2)
    cb()
  })

  q.shift()

  q.start(function (err) {
    t.error(err)
    t.deepEqual(results, [ 2 ])
  })
})

tape('shift async', function (t) {
  t.plan(2)

  var q = queue({ concurrency: 1 })
  var results = []

  q.push(function (cb) {
    results.push(1)
    setTimeout(cb, 100)
  })

  q.push(function (cb) {
    results.push(2)
    cb()
  })

  q.start(function (err) {
    t.error(err)
    t.deepEqual(results, [ 1 ])
  })

  q.shift()
})

tape('slice sync', function (t) {
  t.plan(3)

  var q = queue()
  var results = []

  q.push(function (cb) {
    results.push(1)
    cb()
  })

  q.push(function (cb) {
    results.push(2)
    cb()
  })

  t.equal(q, q.slice(0, 1))

  q.start(function (err) {
    t.error(err)
    t.deepEqual(results, [ 1 ])
  })
})

tape('slice async', function (t) {
  t.plan(3)

  var q = queue({ concurrency: 1 })
  var results = []

  q.push(function (cb) {
    results.push(1)
    setTimeout(cb, 100)
  })

  q.push(function (cb) {
    results.push(2)
    cb()
  })

  q.start(function (err) {
    t.error(err)
    t.deepEqual(results, [ 1 ])
  })

  t.equal(q, q.slice(0, 0))
})

tape('reverse sync', function (t) {
  t.plan(3)

  var q = queue()
  var results = []

  q.push(function (cb) {
    results.push(1)
    cb()
  })

  q.push(function (cb) {
    results.push(2)
    cb()
  })

  t.equal(q, q.reverse())

  q.start(function (err) {
    t.error(err)
    t.deepEqual(results, [ 2, 1 ])
  })
})

tape('indexOf', function (t) {
  t.plan(3)

  var q = queue()
  var results = []

  q.push(job)
  q.push(job)

  t.equal(q.indexOf(job), 0)

  q.start(function (err) {
    t.error(err)
    t.deepEqual(results, [ 1, 2 ])
  })

  function job (cb) {
    results.push(results.length + 1)
    cb()
  }
})

tape('lastIndexOf', function (t) {
  t.plan(3)

  var q = queue()
  var results = []

  q.push(job)
  q.push(job)

  t.equal(q.lastIndexOf(job), 1)

  q.start(function (err) {
    t.error(err)
    t.deepEqual(results, [ 1, 2 ])
  })

  function job (cb) {
    results.push(results.length + 1)
    cb()
  }
})
