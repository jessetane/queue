import tap from 'tap-esm';
import Queue from '../index.js'

tap('autostart', (t) => {
  t.plan(9)
  const expected = ['one', 'two', 'three']
  const actual = []
  const q = new Queue({ autostart: true })
  let numEndHandlers = 0

  q.on('end', () => {
    numEndHandlers++
    t.equal(actual.length, numEndHandlers)

    actual.forEach((a, i) => {
      t.equal(actual[i], expected[i])
    })
  })

  q.push((cb) => {
    actual.push('one')
    cb()
  })

  q.push((cb) => {
    actual.push('two')
    cb()
  })

  setTimeout(() => {
    q.push((cb) => {
      actual.push('three')
      cb()
    })
  }, 10)
})