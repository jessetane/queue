var tape = require('tape');
var queue = require('../');

tape('error', function(t) {
  t.plan(2);

  var q = queue();

  q.push(function(cb) {
    cb(new Error('something broke'));
  });
  
  q.start(function(err) {
    t.equal(err.message, 'something broke');
    t.equal(q.length, 0);
  });
});