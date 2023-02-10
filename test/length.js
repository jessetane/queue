import tap from 'tap-esm';
import Queue from '../index.js'

tap('length', (t) => {
  t.plan(12)
  const q = new Queue()

  q.push((cb) => {
    setTimeout(() => {
      t.equal(q.length, 3)
      cb()
      t.equal(q.length, 2)
    }, 0)
  })

  q.push((cb) => {
    setTimeout(() => {
      t.equal(q.length, 2)
      cb()
      t.equal(q.length, 1)
    }, 10)
  })

  q.push((cb) => {
    setTimeout(() => {
      t.equal(q.length, 1)
      cb()
      t.equal(q.length, 0)
    }, 20)
  })

  t.equal(q.pending, 0)
  t.equal(q.length, 3)

  q.start(() => {
    t.equal(q.pending, 0)
    t.equal(q.length, 0)
  })

  t.equal(q.pending, 3)
  t.equal(q.length, 3)
})