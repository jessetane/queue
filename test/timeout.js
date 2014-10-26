var tape = require('tape');
var queue = require('../');

tape('timeout', function(t) {
  t.plan(4);

  var actual = [];
  var q = queue({ timeout: 100 });
  
  q.on('timeout', function(next) {
    t.ok(q);
    next();
  });

  q.on('end', function() {
    var expected = [ 'two', 'three' ];
    t.equal(actual.length, expected.length);

    for (var i in actual) {
      var a = actual[i];
      var e = expected[i];
      t.equal(a, e);
    }
  });

  q.push(function(cb) {
    // forget to call cb
  });

  q.push(function(cb) {
    actual.push('two');
    cb();
  });

  q.push(function(cb) {
    actual.push('three');
    cb();
  });

  q.start();
});

tape('timeout auto-continue', function(t) {
  t.plan(3);

  var actual = [];
  var q = queue({ timeout: 100 });

  q.on('end', function() {
    var expected = [ 'two', 'three' ];
    t.equal(actual.length, expected.length);

    for (var i in actual) {
      var a = actual[i];
      var e = expected[i];
      t.equal(a, e);
    }
  });

  q.push(function(cb) {
    // forget to call cb
  });

  q.push(function(cb) {
    actual.push('two');
    cb();
  });

  q.push(function(cb) {
    actual.push('three');
    cb();
  });

  q.start();
});
