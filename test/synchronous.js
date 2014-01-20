var tape = require('tape');
var Queue = require('..');

tape('synchronous', function(t) {
  t.plan(4);
  
  var actual = [];
  var q = new Queue();
  
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
    actual.push('three');
    cb();
  });

  q.unshift(function(cb) {
    actual.push('one');
    cb();
  });

  q.splice(1, 0, function(cb) {
    actual.push('two');
    cb();
  });

  q.start();
});
