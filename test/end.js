var tape = require('tape');
var queue = require('../');

tape('end', function(t) {
  t.plan(3);

  var q = queue();

  q.push(function(cb) {
    setTimeout(cb, 0);
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
      }, 100);
    }, 100);
  });

  q.push(function(cb) {
    setTimeout(cb, 300);
  });

  q.start(function(err) {
    t.equal(q.length, 0);
    
    if (err) {
      q.push(function() {});
    }
  });
});