import tap from 'tap-esm';
import Queue from '../index.js'

tap('pop sync', (t) => {
  t.plan(2)

  const q = new Queue()
  const results = []

  q.push((cb) => {
    results.push(1)
    cb()
  })

  q.push((cb) => {
    results.push(2)
    cb()
  })

  q.pop()

  q.start((err) => {
    t.notOk(err)
    t.arrayEqual(results, [ 1 ])
  })
})

tap('pop async', (t) => {
  t.plan(2)
  const q = new Queue({ concurrency: 1 })
  const results = []

  q.push((cb) => {
    results.push(1)
    setTimeout(cb, 10)
  })

  q.push((cb) => {
    results.push(2)
    cb()
  })

  q.start((err) => {
    t.notOk(err)
    t.arrayEqual(results, [ 1 ])
  })

  q.pop()
})

tap('shift sync', (t) => {
  t.plan(2)

  const q = new Queue()
  const results = []

  q.push((cb) => {
    results.push(1)
    cb()
  })

  q.push((cb) => {
    results.push(2)
    cb()
  })

  q.shift()

  q.start((err) => {
    t.notOk(err)
    t.arrayEqual(results, [ 2 ])
  })
})

tap('unshift with autostart', (t) => {
  t.plan(1)
  const q = new Queue({ autostart: true })
  let wasRunning = false

  q.unshift((cb) => {
    wasRunning = true
    cb()
  })

  t.ok(wasRunning)
})

tap('shift async', (t) => {
  t.plan(2)
  const q = new Queue({ concurrency: 1 })
  const results = []

  q.push((cb) => {
    results.push(1)
    setTimeout(cb, 10)
  })

  q.push((cb) => {
    results.push(2)
    cb()
  })

  q.start((err) => {
    t.notOk(err)
    t.arrayEqual(results, [ 1 ])
  })

  q.shift()
})

tap('slice sync', (t) => {
  t.plan(3)

  const q = new Queue()
  const results = []

  q.push((cb) => {
    results.push(1)
    cb()
  })

  q.push((cb) => {
    results.push(2)
    cb()
  })

  t.equal(q, q.slice(0, 1))

  q.start((err) => {
    t.notOk(err)
    t.arrayEqual(results, [ 1 ])
  })
})

tap('slice async', (t) => {
  t.plan(3)
  const q = new Queue({ concurrency: 1 })
  const results = []

  q.push((cb) => {
    results.push(1)
    setTimeout(cb, 10)
  })

  q.push((cb) => {
    results.push(2)
    cb()
  })

  q.start((err) => {
    t.notOk(err)
    t.arrayEqual(results, [ 1 ])
  })

  t.equal(q, q.slice(0, 0))
})

tap('splice with autostart', (t) => {
  t.plan(2)

  const q = new Queue({ autostart: true, concurrency: 1 })
  const results = []

  q.push((cb) => {
    results.push(1)
    setTimeout(cb, 5)
  })

  q.push((cb) => {
    results.push(2)
    cb()
  })

  t.equal(q, q.splice(0, 1))

  setTimeout(() => {
    t.arrayEqual(results, [1])
  }, 10)
})

tap('reverse sync', (t) => {
  t.plan(3)

  const q = new Queue()
  const results = []

  q.push((cb) => {
    results.push(1)
    cb()
  })

  q.push((cb) => {
    results.push(2)
    cb()
  })

  t.equal(q, q.reverse())

  q.start((err) => {
    t.notOk(err)
    t.arrayEqual(results, [ 2, 1 ])
  })
})

tap('indexOf', (t) => {
  t.plan(3)

  const q = new Queue()
  const results = []
  const job = (cb) => {
    results.push(results.length + 1)
    cb()
  }

  q.push(job)
  q.push(job)

  t.equal(q.indexOf(job), 0)

  q.start((err) => {
    t.notOk(err)
    t.arrayEqual(results, [ 1, 2 ])
  })
})

tap('lastIndexOf', (t) => {
  t.plan(4)

  const q = new Queue()
  const results = []
  const job = (cb) => {
    results.push(results.length + 1)
    cb()
  }

  q.push(job)
  q.push(job)

  t.equal(q.lastIndexOf(job), 1)
  t.equal(q.lastIndexOf(job, 1), 1)

  q.start((err) => {
    t.notOk(err)
    t.arrayEqual(results, [ 1, 2 ])
  })
})