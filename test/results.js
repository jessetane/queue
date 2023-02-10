import tap from 'tap-esm';
import Queue from '../index.js'

tap('results', (t) => {
  t.plan(5)
  const q = new Queue({ results: [] })

  q.push(
    (cb) => cb(undefined, 42),
    (cb) => cb(undefined, 3, 2, 1),
    (cb) => cb()
  )

  q.unshift((cb) => {
    setTimeout(() => {
      cb(undefined, 'string')
    }, 10)
  })

  q.start((err, results) => {
    t.notOk(err);

    [
      ['string'],
      [42],
      [3, 2, 1],
      []
    ].forEach((expected, i) => {
      t.arrayEqual(expected, results[i])
    })
  })
})