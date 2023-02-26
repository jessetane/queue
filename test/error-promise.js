import tap from 'tap-esm';
import Queue from '../index.js'

tap('error-promise with error', (t) => {
  t.plan(2)
  const q = new Queue()

  q.addEventListener('end', (event) => {
    t.equal(event.detail.error.message, 'something broke')
    t.equal(q.length, 0)
  })

  q.push((cb) => {
    setTimeout(cb, 10)
  })

  q.push(async () => {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('something broke'))
      }, 20)
    })
  })

  q.push(async () => {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 30)
    })
  })

  q.start()
})

tap('error-promise with empty error', (t) => {
  t.plan(2)
  const q = new Queue()

  q.addEventListener('end',  (event) => {
    t.equal(event.detail.error, true)
    t.equal(q.length, 0)
  })

  q.push((cb) => {
    setTimeout(cb, 10)
  })

  q.push(async () => {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject()
      }, 20)
    })
  })

  q.push(async () => {
    return await new Promise(function (resolve) {
      setTimeout(() => {
        resolve()
      }, 30)
    })
  })

  q.start()
})
