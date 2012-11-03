#!/usr/bin/env node

/*
 *  concurrent.js
 *
 */


var assert = require("assert");
var Queue = require("../queue");

var answers = [];
var q = new Queue(100);
q.on("drain", function () {
  var solutions = ["one", "two", "three"];
  for (var i in answers) {
    var answer = answers[i];
    var solution = solutions[i];
    assert(answer === solution, "Answer '" + answer + "' doesn't match solution '" + solution + "'.");
  }
  console.log("It works!  ✔");
});

q.push(function (cb) {
  setTimeout(function () {
    answers.push("one");
    cb();
  }, 1);
});

q.push(function (cb) {
  setTimeout(function () {
    answers.push("three");
    cb();
  }, 3);
});

q.push(function (cb) {
  setTimeout(function () {
    answers.push("two");
    cb();
  }, 2);
});
