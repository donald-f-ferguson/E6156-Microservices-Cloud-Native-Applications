/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var Benchmark = require('benchmark');



/**
 * bench()
 *
 * (see https://benchmarkjs.com/docs#Benchmark)
 * ---------------------------
 * @param  {String}   name
 * @param  {Array}   testFns  [array of functions]
 * @param  {Function} done
 */

module.exports = function bench (name, testFns, done) {

  var suite = new Benchmark.Suite({ name: name });

  _.each(testFns, function (testFn, i) {
    suite = suite.add((testFn.name||name)+'#'+i, {
      defer: true,
      fn: function(deferred){

        var oneTickHasElapsed;
        setImmediate(function (){
          oneTickHasElapsed = true;
        });

        testFn(function (err) {
          if (err) {
            console.error('An error occured when attempting to run benchmark:\n',err);
          }//>-

          // Ensure one tick has elapsed before proceeding
          // (otherwise, benchmark doesn't work properly)
          if (oneTickHasElapsed) {
            deferred.resolve();
          }
          else {
            setImmediate(function (){
              deferred.resolve();
            });
          }

        });
      }
    });
  });//</each testFn>

  suite.on('cycle', function(event) {
    console.log(' •',String(event.target));
  })
  .on('complete', function() {
    // console.log('Fastest is ' + this.filter('fastest').map('name'));
    // console.log('Slowest is ' + this.filter('slowest').map('name'));
    return done();
  })
  .run({ async: true });

};




// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// For posterity, here's how to do it asynchronously:

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// module.exports = function bench (name, testFns, done) {
//   var suite = new Benchmark.Suite({ name: name });
//   _.each(testFns, function (testFn, i) {
//     suite = suite.add(testFn.name+'#'+i, {
//       defer: true,
//       fn: function (deferred) {
//         testFn(function _afterRunningTestFn(err){
//           setImmediate(function _afterEnsuringAsynchronous(){
//             if (err) {
//               console.error('An error occured when attempting to benchmark this code:\n',err);
//             }//>- (resolve the deferred either way)
//             deferred.resolve();
//           });//</afterwards cb from waiting for nextTick>
//         });//</afterwards cb from running test fn>
//       }
//     });//<suite.add>
//   });//</each testFn>

//   suite.on('cycle', function(event) {
//     console.log(' •',String(event.target));
//   })
//   .on('complete', function() {
//     console.log('Fastest is ' + this.filter('fastest').map('name'));
//     console.log('Slowest is ' + this.filter('slowest').map('name'));
//     return done(undefined, this);
//   })
//   .run();
// };
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
