var tape = require('tape');
var queue = require('../');

tape('error', function(t) {
  t.plan(2);

  var q = queue();

  q.on('error', q.end.bind(q));
  q.on('end', function(err) {
    t.equal(err.message, 'something broke');
    t.equal(q.length, 0);
  });

  q.push(function(cb) {
    setTimeout(cb, 30);
  });

  q.push(function(cb) {
    setTimeout(function() {
      cb(new Error('something broke'));
    }, 60);
  });

  q.push(function(cb) {
    setTimeout(cb, 90);
  });
  
  q.start();
});