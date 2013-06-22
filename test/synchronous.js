#!/usr/bin/env node

/*
 *  synchronous.js
 *
 */

var assert = require('assert');
var Queue = require('..');

var answers = [];
var q = new Queue();
q.on('drain', function() {
  var solutions = [ 'one', 'two', 'three' ];
  assert(answers.length === solutions.length, "Answers '" + answers + "' don't match solutions '" + solutions + "'.");
  
  for (var i in answers) {
    var answer = answers[i];
    var solution = solutions[i];
    assert(answer === solution, "Answer '" + answer + "' doesn't match solution '" + solution + "'.");
  }
  console.log('Synchronous works!  ✔');
});

q.push(function(cb) {
  answers.push('three');
  cb();
});

q.unshift(function(cb) {
  answers.push('one');
  cb();
});

q.splice(1, 0, function(cb) {
  answers.push('two');
  cb();
});
