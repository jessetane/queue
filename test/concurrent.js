var tape = require('tape');
var queue = require('../');

tape('concurrent', function(t) {
  t.plan(4);
  
  var actual = [];
  var q = queue({ concurrency: 100 });
  
  q.on('end', function() {
    var expected = [ 'one', 'two', 'three' ];
    t.equal(actual.length, expected.length);

    for (var i in actual) {
      var a = actual[i];
      var e = expected[i];
      t.equal(a, e);
    }
  });

  q.push(function(cb) {
    setTimeout(function() {
      actual.push('one');
      cb();
    }, 1);
  });

  q.push(function(cb) {
    setTimeout(function() {
      actual.push('three');
      cb();
    }, 6);
  });

  q.push(function(cb) {
    setTimeout(function() {
      actual.push('two');
      cb();
    }, 3);
  });

  q.start();
});
