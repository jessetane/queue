import tap from 'tap-esm';
import Queue from '../index.js'

tap('resume', (t) => {
  t.plan(16)
  const q = new Queue({ concurrency: 2 })

  let jobsToSet = 16

  while (jobsToSet-- !== 0) {
    q.push((cb) => {
      setTimeout(() => {
        t.ok(q)
        cb()
      }, 10)
    })
  }

  // start
  q.start()

  // and stop somewhere in the middle of queue
  setTimeout(function () {
    q.stop()
    q.start()
  }, 30)
})