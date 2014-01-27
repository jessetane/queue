var tape = require('tape');
var queue = require('..');

tape('end', function(t) {
  t.plan(3);

  var q = queue({ concurrency: Infinity });

  q.on('end', function(err) {
    t.equal(q.length, 0);
    
    if (err) {
      q.push(function(cb) { 
        setTimeout(cb, 5);
      });
    }
  });

  q.push(function(cb) {
    setTimeout(cb, 3);
  });

  q.push(function(cb) {
    setTimeout(function() {
      t.equal(q.length, 2);
      q.end(new Error('fake error'));
      setTimeout(function() {
        
        // session has changed so this should be a nop
        cb();
        
        // and we should still have one job left
        t.equal(q.length, 1);
      }, 3);
    }, 5);
  });

  q.push(function(cb) {
    setTimeout(cb, 7);
  });
  
  q.start();
});