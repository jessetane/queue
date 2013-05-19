/*
 *  queue.js
 *
 */

module.exports = Queue;

var EventEmitter = require('events').EventEmitter;

function Queue(options) {
  options = options || {};
  this.concurrency = options.concurrency || 1;
  this.timeout = options.timeout || 0;
  this.pending = 0;
  this.jobs = [];
}
Queue.prototype = new EventEmitter;

Queue.prototype.__defineGetter__('length', function() {
  return this.pending + this.jobs.length;
});

// expose selected array methods
[ 'pop', 'shift', 'slice', 'reverse', 'indexOf', 'lastIndexOf' ].forEach(function(method) {
  Queue.prototype[method] = function() {
    return Array.prototype[method].apply(this.jobs, arguments);
  }
});

// additive Array methods should auto-advance the queue
[ 'push', 'unshift', 'splice' ].forEach(function(method) {
  Queue.prototype[method] = function() {
    process.nextTick(this.process.bind(this));
    return Array.prototype[method].apply(this.jobs, arguments);
  }
});

Queue.prototype.process = function() {
  if (this.jobs.length > 0 && this.pending < this.concurrency) {
    this.pending++;
    
    var job = this.jobs.shift();
    var self = this;
    var once = true;
    var timeoutId = null;
    var didTimeout = false;
    
    var next = function() {
      if (once) {
        once = false;
        self.pending--;
        if (timeoutId !== null) clearTimeout(timeoutId);
        if (didTimeout === false) self.emit('processed', job);
        if (self.pending === 0 && self.jobs.length === 0) {
          self.emit('drain', self);
        } else {
          self.process();
        }
      }
    }
    
    if (this.timeout) {
      timeoutId = setTimeout(function() {
        didTimeout = true;
        self.emit('timeout', job, next);
      }, this.timeout);
    }
    
    job(next);
    this.process();
  }
}
