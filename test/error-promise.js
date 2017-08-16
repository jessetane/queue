var Promise = require('bluebird')
var tape = require('tape')
var queue = require('../')

tape('error-promise with error', function (t) {
  t.plan(2)

  var q = queue()

  q.on('error', q.end.bind(q))
  q.on('end', function (err) {
    t.equal(err.message, 'something broke')
    t.equal(q.length, 0)
  })

  q.push(function (cb) {
    setTimeout(cb, 100)
  })

  q.push(function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject(new Error('something broke'))
      }, 200)
    })
  })

  q.push(function () {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve, 300)
    })
  })

  q.start()
})

tape('error-promise with empty error', function (t) {
  t.plan(2)

  var q = queue()

  q.on('error', q.end.bind(q))
  q.on('end', function (err) {
    t.equal(err, true)
    t.equal(q.length, 0)
  })

  q.push(function (cb) {
    setTimeout(cb, 100)
  })

  q.push(function () {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject()
      }, 200)
    })
  })

  q.push(function () {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve, 300)
    })
  })

  q.start()
})

