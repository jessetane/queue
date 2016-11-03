const {EventEmitter} = require('events')

const callOnErrorOrEnd = function(cb) {
  const onerror = (err) => {
    this.end(err)
  }
  
  const onend = (err) => {
    this.removeListener('error', onerror);
    this.removeListener('end', onend);
    cb(err);
  }

  this.on('error', onerror);
  this.on('end', onend);
}

const done = function(err) {
  this.session++;
  this.running = false;
  this.emit('end', err);
}

class Queue extends EventEmitter{
  constructor(options = {}){
    super()

    this.concurrency = options.concurrency || Infinity;
    this.autostart = options.autostart || false;
    this.timeout = options.timeout || 0;
    this.pending = 0;
    this.session = 0;
    this.running = false;
    this.jobs = [];    
  }

  push(...args){
    this.jobs.push(...args)
    if(!this.running && this.autostart){
      this.start()
    }
  }

  unshift(...args){
    this.jobs.push(...args)
    if(!this.running && this.autostart){
      this.start()
    }
  }

  start(cb) {
    if (cb) {
      callOnErrorOrEnd.call(this, cb);
    }

    if (this.pending === this.concurrency) {
      return;
    }
    
    if (this.jobs.length === 0) {
      if (this.pending === 0) {
        done.call(this);
      }
      return;
    }
    
    const job       = this.jobs.shift(),
          session   = this.session;

    let once        = true,
        timeoutId   = null,
        didTimeout  = false;
    
    const next = (err, result) => {
      if (once && this.session === session) {
        once = false;
        this.pending--;
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }
        
        if (err) {
          this.emit('error', err, job);
        } else if (didTimeout === false) {
          this.emit('success', result, job);
        }
        
        if (this.session === session) {
          if (this.pending === 0 && this.jobs.length === 0) {
            done.call(this);
          } else if (this.running) {
            this.start();
          }
        }
      }
    }
    
    if (this.timeout) {
      timeoutId = setTimeout(() => {
        didTimeout = true;
        if (this.listeners('timeout').length > 0) {
          this.emit('timeout', next, job);
        } else {
          next();
        }
      }, this.timeout);
    }
    
    this.pending++;
    this.running = true;
    job(next);
    
    if (this.jobs.length > 0) {
      this.start();
    }
  };

  stop() {
    this.running = false;
  };

  end(err) {
    this.jobs.length = 0;
    this.pending = 0;
    done.call(this, err);
  };

  get length(){
    return this.pending + this.jobs.length
  }
}

const arrayMethods = [
  'splice',
  'pop',
  'shift',
  'slice',
  'reverse',
  'indexOf',
  'lastIndexOf'
]

const arrayMethodsExtended = [
  'push',
  'unshift'
]

const emulateMethod = function(array, name, ...args){
  return array[name](...args)
}

for (let method of arrayMethods){
  Queue.prototype[method] = function(...args) {
    return emulateMethod(this.jobs, method, ...args)
  };
}

for (let method of arrayMethodsExtended){
  Queue.prototype[method] = function(...args) {
    const result = emulateMethod(this.jobs, method, ...args)
    if(!this.running && this.autostart) this.start()
    return result
  };
}

module.exports = Queue
