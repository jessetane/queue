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

tap('promise returned from the job must be set to the job.promise property', (t) => {
  t.plan(1)
  const q = new Queue({ concurrency: 1 })
  let promise;

  q.addEventListener('success',(event) => {
    t.equal(event.detail.job.promise, promise)
  })

  q.push(() => {
    promise = new Promise((resolve) => resolve());

    return promise;
  })

  q.start()
})

tap('promise returned from an async job should be set to the job.promise property', (t) => {
  t.plan(1)
  const q = new Queue({ concurrency: 1 })

  q.addEventListener('success',async (event) => {
    const result = await event.detail.job.promise;

    t.equal(result, 'result');
  })

  q.push(async () => 'result');

  q.start()
})