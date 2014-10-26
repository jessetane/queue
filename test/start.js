var tape = require('tape');
var queue = require('../');

tape('start', function(t) {
  t.plan(3);

  var q = queue();

  q.push(function(cb) {
    t.ok(q);
    cb();
  });

  q.start(function() {
    t.ok(q);
    
    q.start(function() {
      t.ok(q);
    });
  });
});
