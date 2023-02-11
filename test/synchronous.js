import tap from 'tap-esm';
import Queue from '../index.js'

tap('synchronous', (t) => {
  t.plan(4)

  const actual = []
  const q = new Queue({ concurrency: 1 })

  q.addEventListener('end', () => {
    const expected = ['one', 'two', 'three']
    t.equal(actual.length, expected.length)

    actual.forEach((a, i) => {
      const e = expected[i]
      t.equal(a, e)
    })
  })

  q.push((cb) => {
    actual.push('three')
    cb()
  })

  q.unshift((cb) => {
    actual.push('one')
    cb()
  })

  q.splice(1, 0, (cb) => {
    actual.push('two')
    cb()
  })

  q.start()
})
