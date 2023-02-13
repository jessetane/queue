import tap from 'tap-esm';
import Queue from '../index.js'

tap('timeout', (t) => {
  t.plan(4)
  const actual = []
  const q = new Queue({ timeout: 10 })

  q.addEventListener('timeout', (event) => {
    t.ok(q)
    event.detail.next()
  })

  q.addEventListener('end', () => {
    const expected = ['two', 'three']
    t.equal(actual.length, expected.length)

    actual.forEach((a, i) => {
      const e = expected[i]
      t.equal(a, e)
    })
  })

  q.push((cb) => {
    // forget to call cb
  })

  q.push((cb) => {
    actual.push('two')
    cb()
  })

  q.push((cb) => {
    actual.push('three')
    cb()
  })

  q.start()
})

tap('job timeout', (t) => {
  t.plan(2)
  const q = new Queue({ timeout: 5 })
  let timeouts = 0
  const willTimeout = (cb) => {
    setTimeout(cb, 8)
  }
  const wontTimeout = (cb) => {
    setTimeout(cb, 8)
  }

  wontTimeout.timeout = 10

  q.addEventListener('timeout', (event) => {
    t.ok(q)
    timeouts++
    event.detail.next()
  })

  q.addEventListener('end', () => {
    t.equal(timeouts, 1)
  })

  q.push(willTimeout)
  q.push(wontTimeout)

  q.start()
})

tap('job-based opt-out of timeout', (t) => {
  t.plan(1)
  const q = new Queue({ timeout: 5 })
  let timeouts = 0
  const wontTimeout = (cb) => {
    setTimeout(cb, 8)
  }

  wontTimeout.timeout = undefined

  q.addEventListener('timeout', (event) => {
    t.fail('Job should not have timed-out')
    timeouts++
    event.detail.next()
  })

  q.addEventListener('end',  () => {
    t.equal(timeouts, 0)
  })

  q.push(wontTimeout)

  q.start()
})

tap('timeout auto-continue',  (t) => {
  t.plan(3)
  const actual = []
  const q = new Queue({ timeout: 10 })

  q.addEventListener('end',  () => {
    const expected = ['two', 'three']
    t.equal(actual.length, expected.length)

    actual.forEach((a, i) => {
      const e = expected[i]
      t.equal(a, e)
    })
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

tap('unref timeouts',  (t) => {
  t.plan(3)
  const q = new Queue({ timeout: 99999 })

  q.push(function (cb) {
    t.pass()
    // forget to call cb
  })

  q.start()

  q.stop()

  setTimeout(() => {
    t.equal(q.pending, 1)

    q.end()

    t.equal(q.pending, 0)
  }, 10)
})
