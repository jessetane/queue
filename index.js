import { EventEmitter } from 'events';

const has = Object.prototype.hasOwnProperty

export default class Queue extends EventEmitter {
  constructor (options = {}) {
    super()
    const { concurrency = Infinity, timeout = 0, autostart = false, results = null } = options

    this.concurrency = concurrency
    this.timeout = timeout
    this.autostart = autostart
    this.results = results
    this.pending = 0
    this.session = 0
    this.running = false
    this.jobs = []
    this.timers = []
  }

  pop () {
    return this.jobs.pop()
  }

  shift () {
    return this.jobs.shift()
  }

  indexOf (searchElement, fromIndex) {
    return this.jobs.indexOf(searchElement, fromIndex)
  }

  lastIndexOf (searchElement, fromIndex) {
    if (fromIndex !== undefined) { return this.jobs.lastIndexOf(searchElement, fromIndex) }
    return this.jobs.lastIndexOf(searchElement)
  }

  slice (start, end) {
    this.jobs = this.jobs.slice(start, end)
    return this
  }

  reverse () {
    this.jobs.reverse()
    return this
  }

  push (...workers) {
    const methodResult = this.jobs.push(...workers)
    if (this.autostart) {
      this.start()
    }
    return methodResult
  }

  unshift (...workers) {
    const methodResult = this.jobs.unshift(...workers)
    if (this.autostart) {
      this.start()
    }
    return methodResult
  }

  splice (start, deleteCount, ...workers) {
    this.jobs.splice(start, deleteCount, ...workers)
    if (this.autostart) {
      this.start()
    }
    return this
  }

  get length () {
    return this.pending + this.jobs.length
  }

  start (callback) {
    if (callback) {
      this.callOnErrorOrEnd(callback)
    }

    this.running = true

    if (this.pending >= this.concurrency) {
      return
    }

    if (this.jobs.length === 0) {
      if (this.pending === 0) {
        this.done()
      }
      return
    }

    const job = this.jobs.shift()
    const session = this.session
    const timeout = (job !== undefined) && has.call(job, 'timeout') ? job.timeout : this.timeout
    let once = true
    let timeoutId = null
    let didTimeout = false
    let resultIndex = null

    const next = (err, ...result) => {
      if (once && this.session === session) {
        once = false
        this.pending--
        if (timeoutId !== null) {
          this.timers = this.timers.filter((tID) => tID !== timeoutId)
          clearTimeout(timeoutId)
        }

        if (err) {
          this.emit('error', err, job);
        } else if (!didTimeout) {
          if (resultIndex !== null && this.results !== null) {
            this.results[resultIndex] = [...result]
          }
          this.emit('success', result, job)
        }

        if (this.session === session) {
          if (this.pending === 0 && this.jobs.length === 0) {
            this.done()
          } else if (this.running) {
            this.start()
          }
        }
      }
    }

    if (timeout) {
      timeoutId = setTimeout(() => {
        didTimeout = true
        this.emit('timeout', next, job)
        next()
      }, timeout)
      this.timers.push(timeoutId)
    }

    if (this.results != null) {
      resultIndex = this.results.length
      this.results[resultIndex] = null
    }

    this.pending++
    this.emit('start', job)

    const promise = job(next)

    if (promise !== undefined && typeof promise.then === 'function') {
      promise.then(function (result) {
        return next(undefined, result)
      }).catch(function (err) {
        return next(err || true)
      })
    }

    if (this.running && this.jobs.length > 0) {
      this.start()
    }
  }

  stop () {
    this.running = false
  }

  end (error) {
    this.clearTimers()
    this.jobs.length = 0
    this.pending = 0
    this.done(error)
  }

  clearTimers () {
    this.timers.forEach((timer) => {
      clearTimeout(timer)
    })

    this.timers = []
  }

  callOnErrorOrEnd (cb) {
    const onerror = (err) => this.end(err)
    const onend = (err) => {
      this.removeListener('error', onerror)
      this.removeListener('end', onend)
      cb(err, this.results)
    }
    this.addListener('error', onerror)
    this.addListener('end', onend)
  }

  done (err) {
    this.session++
    this.running = false
    this.emit('end', err)
  }
}