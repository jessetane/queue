var tape = require('tape');
var queue = require('../');

tape('autostart', function(t) {
  t.plan(9);
  var expected = [ 'one', 'two', 'three' ];
  var actual = [];
  var q = queue({ autostart: true });
  var numEndHandlers = 0;

  q.on('end', function() {
    numEndHandlers++;
    t.equal(actual.length, numEndHandlers);

    for (var i in actual) {
      t.equal(actual[i], expected[i]);
    }
  });

  q.push(function(cb) {
    actual.push('one');
    cb();
  });
  q.push(function (cb) {
    actual.push('two');
    cb();
  });
  setTimeout(function () {
    q.push(function (cb) {
      actual.push('three');
      cb();
    });
  }, 1000);
})
