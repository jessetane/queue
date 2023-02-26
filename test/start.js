import tap from 'tap-esm';
import Queue from '../index.js'

tap('start', (t) => {
  t.plan(4)

  const q = new Queue()
  const work = (cb) => {
    t.ok(q)
    cb()
  }

  q.addEventListener('start', (event) => {
    t.equal(event.detail.job, work)
  })

  q.push(work)

  q.start(() => {
    t.ok(q)

    q.start(() => {
      t.ok(q)
    })
  })
})

tap('await start. Push the job, start() returns Promise waiting for all jobs to finish', async (t) => {
  t.plan(1)
  const queue = new Queue();
  const result = [];
  const work = (cb) => {
    setTimeout(() => {
      result.push(1);
      cb();
    }, 30)
  }

  queue.push(work);
  await queue.start();
  result.push(2);
  console.log(result);

  t.arrayEqual(result, [1, 2]);
});
