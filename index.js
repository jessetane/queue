/**
 *  queue.js
 */

/**
 *  deps
 */
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

/**
 *  export class
 */
module.exports = Queue;

/**
 *  constructor
 */
function Queue(options) {
  EventEmitter.call(this);
  options = options || {};
  this.concurrency = options.concurrency || 1;
  this.timeout = options.timeout || 0;
  this.pending = 0;
  this.session = 0;
  this.jobs = [];
}
inherits(Queue, EventEmitter);

/**
 *  expose selected array methods
 */
var arrayMethods = [
  'push',
  'unshift',
  'splice',
  'pop',
  'shift',
  'slice',
  'reverse',
  'indexOf',
  'lastIndexOf'
];

for (var method in arrayMethods) {
  (function(method) {
    Queue.prototype[method] = function() {
      return Array.prototype[method].apply(this.jobs, arguments);
    };
  })(arrayMethods[method]);
}

/**
 *  expose array.length
 */
Queue.prototype.__defineGetter__('length', function() {
 return this.pending + this.jobs.length;
});

/**
 *  start processing the queue
 */
Queue.prototype.start = function() {
  if (this.pending === this.concurrency) {
    return;
  }
  
  if (this.jobs.length === 0) {
    if (this.pending === 0) {
      done.call(this);
    }
    return;
  }
  
  var job = this.jobs.shift();
  var self = this;
  var once = true;
  var session = this.session;
  var timeoutId = null;
  var didTimeout = false;
  
  var next = function(err) {
    if (once && self.session === session) {
      once = false;
      self.pending--;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      if (err) {
        self.emit('error', err, job);
      } else if (didTimeout === false) {
        self.emit('didProcessJob', job);
      }
      if (self.pending === 0 && self.jobs.length === 0) {
        done.call(self);
      } else {
        self.start();
      }
    }
  };
  
  if (this.timeout) {
    timeoutId = setTimeout(function() {
      didTimeout = true;
      if (self.listeners('timeout').length > 0) {
        self.emit('timeout', job, next);
      } else {
        next();
      }
    }, this.timeout);
  }
  
  this.pending++;
  job(next);
  
  if (this.jobs.length > 0) {
    this.start();
  }
};

/**
 *  clear the queue including any running jobs
 */
Queue.prototype.stop = function() {
  if (this.jobs.length || this.pending) {
    this.jobs = [];
    this.pending = 0;
    this.session++;
  }
};

/**
 *  all done
 */
function done() {
  this.emit('end', this);
  this.session++;
};
