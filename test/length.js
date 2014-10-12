var tape = require('tape');
var queue = require('../');

tape('length', function(t) {
  t.plan(12);

  var q = queue();

  q.push(function(cb) {
    setTimeout(function() {
      t.equal(q.length, 3);
      cb();
      t.equal(q.length, 2);
    }, 0);
  });

  q.push(function(cb) {
    setTimeout(function() {
      t.equal(q.length, 2);
      cb();
      t.equal(q.length, 1);
    }, 100);
  });

  q.push(function(cb) {
    setTimeout(function() {
      t.equal(q.length, 1);
      cb();
      t.equal(q.length, 0);
    }, 200);
  });

  t.equal(q.pending, 0);
  t.equal(q.length, 3);

  q.start(function() {
    t.equal(q.pending, 0);
    t.equal(q.length, 0);
  });
  
  t.equal(q.pending, 3);
  t.equal(q.length, 3);
});
