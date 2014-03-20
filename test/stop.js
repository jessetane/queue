var tape = require('tape');
var queue = require('../');

tape('stop', function(t) {
  t.plan(4);

  var q = queue();
  
  q.on('end', function() {
    t.equal(q.running, false);
  });

  q.push(function(cb) {
    setTimeout(function() {
      t.equal(q.running, false);
      cb();
      
      // restart
      setTimeout(function() {
        q.start();
      }, 10);
    }, 10);
  });
  
  q.push(function(cb) {
    t.equal(q.running, true);
    cb();
  });
  
  // start
  q.start();
  
  // but stop the q before the first job has finished
  setTimeout(function() {
    t.equal(q.length, 2);
    q.stop();
  }, 5);
});