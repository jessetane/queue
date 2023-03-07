import tap from 'tap-esm';
import Queue from '../index.js'

tap('error-sync', (t) => {
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


tap('error-sync. start() should return a promise with error data.', async (t) => {
  t.plan(2)

  const q = new Queue()

  q.push((cb) => {
    cb(new Error('something broke'))
  })

  const { error } = await q.start()
  t.equal(error.message, 'something broke')
  t.equal(q.length, 0)
})
