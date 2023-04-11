import tap from 'tap-esm';
import Queue from '../index.js'

tap('error-async', (t) => {
  t.plan(2)
  const q = new Queue({ autostart: true })

  q.addEventListener('end', (event) => {
    t.equal(event.detail.error.message, 'something broke') // 3
    t.equal(q.length, 0)
  })

  q.push((cb) => {
    setTimeout(cb, 10)
  })

  q.push((cb) => {
    setTimeout(() => {
      cb(new Error('something broke'))
    }, 20)
  })

  q.push((cb) => {
    setTimeout(cb, 30)
  })
})


tap('error-async. start() should return a promise with error data.', async (t) => {
  t.plan(2)
  const q = new Queue()

  q.push((cb) => {
    setTimeout(cb, 10)
  })

  q.push((cb) => {
    setTimeout(() => {
      cb(new Error('something broke'))
    }, 20)
  })

  q.push((cb) => {
    setTimeout(cb, 30)
  })

  try {
    await q.start()
  } catch (err) {
    t.equal(err.message, 'something broke') // 3
    t.equal(q.length, 0)
  }
})
