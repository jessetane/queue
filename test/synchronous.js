#!/usr/bin/env node

/*
 *  synchronous.js
 *
 */


var assert = require("assert");
var Queue = require("../queue");

var answers = [];
var q = new Queue();
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
  answers.push("one");
  cb();
});

q.push(function (cb) {
  answers.push("two");
  cb();
});

q.push(function (cb) {
  answers.push("three");
  cb();
});
