import tap from 'tap-esm';
import Queue from '../index.js'

tap('error', (t) => {
  t.plan(2)

  const q = new Queue()

  q.push((cb) => {
    cb(new Error('something broke'))
  })

  q.start((err) => {
    t.equal(err.message, 'something broke')
    t.equal(q.length, 0)
  })
})