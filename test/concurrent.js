import tap from 'tap-esm';
import Queue from '../index.js'

tap('concurrent', (t) => {
  t.plan(6)
  const actual = []
  const q = new Queue()
  q.concurrency = 2

  q.push((cb) => {
    setTimeout(() => {
      actual.push('two')
      cb()
    }, 20)
  })

  q.push((cb) => {
    setTimeout(() => {
      actual.push('one')
      cb()
    }, 0)
  })

  q.push((cb) => {
    q.concurrency = 1
    setTimeout(() => {
      actual.push('three')
      cb()
    }, 30)
  })

  q.push((cb) => {
    setTimeout(() => {
      actual.push('four')
      cb()
    }, 10)
  })

  q.push((cb) => {
    setTimeout(() => {
      actual.push('five')
      cb()
    }, 0)
  })

  q.start(() => {
    const expected = ['one', 'two', 'three', 'four', 'five']
    t.equal(actual.length, expected.length)

    actual.forEach((a, i) => {
      const e = expected[i]
      t.equal(a, e)
    })
  })
})