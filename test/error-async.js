import tap from 'tap-esm';
import Queue from '../index.js'

tap('error', (t) => {
  t.plan(2)
  const q = new Queue()

  q.on('error', (err) => {
    q.end(err)
  })
  q.on('end', (err) => {
    t.equal(err.message, 'something broke') // 3
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

  q.start()
})