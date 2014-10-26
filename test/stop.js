var tape = require('tape');
var queue = require('../');

tape('stop', function(t) {
  t.plan(5);

  var q = queue({ concurrency: 1 });

  q.push(function(cb) {
    setTimeout(function() {
      t.equal(q.running, false);
      cb();
      
      // restart
      setTimeout(function() {
        q.start(function() {
          t.ok(q);
        });
      }, 100);
    }, 100);
  });
  
  q.push(function(cb) {
    t.equal(q.running, true);
    cb();
  });
  
  // start
  q.start(function(err) {
    t.equal(q.running, false);
  });
  
  // but stop the q before the first job has finished
  setTimeout(function() {
    t.equal(q.length, 2);
    q.stop();
  }, 0);
});
