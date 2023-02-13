import tap from 'tap-esm';
import Queue from '../index.js'

tap('promises', (t) => {
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

  q.push(async () => {
    actual.push('three')
  })

  q.unshift(async () => {
    actual.push('one')
  })

  q.splice(1, 0, async () => {
    actual.push('two')
  })

  q.start()
})
