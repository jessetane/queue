#!/usr/bin/env node

/*
 *  concurrent.js
 *
 */

var assert = require('assert');
var Queue = require('..');

var answers = [];
var q = new Queue({ concurrency: 100 });
q.on('drain', function() {
  var solutions = [ 'one', 'two', 'three' ];
  assert(answers.length === solutions.length, "Answers '" + answers + "' don't match solutions '" + solutions + "'.");

  for (var i in answers) {
    var answer = answers[i];
    var solution = solutions[i];
    assert(answer === solution, "Answer '" + answer + "' doesn't match solution '" + solution + "'.");
  }
  console.log('Concurrent works!  ✔');
});

q.push(function(cb) {
  setTimeout(function() {
    answers.push('one');
    cb();
  }, 1);
});

q.push(function(cb) {
  setTimeout(function() {
    answers.push('three');
    cb();
  }, 6);
});

q.push(function(cb) {
  setTimeout(function() {
    answers.push('two');
    cb();
  }, 3);
});
