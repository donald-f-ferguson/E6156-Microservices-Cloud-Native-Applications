/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var Benchmark = require('benchmark');



/**
 * benchSync()
 *
 * (see https://benchmarkjs.com/docs#Benchmark)
 * ---------------------------
 * @param  {String}   name
 * @param  {Array}   testFns  [array of functions]
 */

module.exports = function benchSync (name, testFns) {

  var suite = new Benchmark.Suite({ name: name });

  _.each(testFns, function (testFn, i) {
    suite = suite.add((testFn.name||name)+'#'+i, testFn);
  });//</each testFn>

  suite.on('cycle', function(event) {
    console.log(' •',String(event.target));
  })
  .on('complete', function() {
    // console.log('Fastest is ' + this.filter('fastest').map('name'));
    // console.log('Slowest is ' + this.filter('slowest').map('name'));
  })
  .run();

};
