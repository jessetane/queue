/*
 *  queue.js
 *
 */

module.exports = Queue;

var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Queue(options) {
  options = options || {};
  this.concurrency = options.concurrency || 1;
  this.timeout = options.timeout || 0;
  this.pending = 0;
}
util.inherits(Queue, Array);
util._extend(Queue.prototype, EventEmitter.prototype);  // how to multiple inherit?

Queue.prototype.advance = function() {
  if (this.length > 0 && this.pending < this.concurrency) {
    this.pending++;
    EventEmitter.prototype.emit.call(this, 'advance');
    
    var job = this.shift();
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
        if (self.pending === 0 && self.length === 0) {
          EventEmitter.prototype.emit.call(self, 'drain');
        } else {
          self.advance();
        }
      }
    }
    
    if (this.timeout) {
      timeoutId = setTimeout(function() {
        EventEmitter.prototype.emit.call(self, 'timeout', next, job);
      }, this.timeout);
    }
    
    job(next);
    this.advance();
  }
}

// wrap additive array methods so the queue will
// advance automatically on process.nextTick
var methods = [ 'push', 'unshift', 'splice' ];
methods.forEach(function(method) {
  Queue.prototype[method] = function() {
    Array.prototype[method].apply(this, arguments);
    process.nextTick(this.advance.bind(this));
  }
});
