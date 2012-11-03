#!/usr/bin/env node

/*
 *  example.js
 *
 */


var Queue = require("../queue");

var results = [];
var q = new Queue();

// add a drain handler
q.on("drain", function () {
  console.log("All done:", results);
});

// add individual functions
q.push(function (cb) {
  results.push("one");
  cb();
}, function (err, jobQueue) {
  console.log("This is a job specific callback");
});

// add arrays of functions
q.push([
  function (cb) {
    results.push("two");
    cb();
  },
  function (cb) {
    results[2] = "three";
    cb();
  }
]);
