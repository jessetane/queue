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

[ 'push', 'pop', 'shift', 'unshift', 'splice', 'slice', 'reverse', 'indexOf', 'lastIndexOf' ].forEach(function(method) {
  Queue.prototype[method] = function() {
    if (method === 'push' || 
        method === 'unshift' || 
        method === 'splice') {
          
      // additive Array methods should auto-advance the queue
      process.nextTick(this.advance.bind(this));
    }
    return Array.prototype[method].apply(this.jobs, arguments);
  }
});

Queue.prototype.advance = function() {
  if (this.jobs.length > 0 && this.pending < this.concurrency) {
    this.pending++;
    this.emit('advance');
    
    var job = this.jobs.shift();
    var self = this;
    var once = true;
    var timeoutId = null;
    
    var next = function() {
      if (once) {
        once = false;
        self.pending--;
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }
        if (self.pending === 0 && self.jobs.length === 0) {
          self.emit('drain');
        } else {
          self.advance();
        }
      }
    }
    
    if (this.timeout) {
      timeoutId = setTimeout(function() {
        self.emit('timeout', next, job);
      }, this.timeout);
    }
    
    job(next);
    this.advance();
  }
}
