/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var flaverr = require('flaverr');


// This is used by find.fixture.js.
// It was originally and part of a benchmarking experiment, and its extrapolation
// was found to have a positive impact on performance.
module.exports = function helpFind(unused, metadata, finalCb) {
  if (unused) {
    finalCb(new Error('Consistency violation: Unexpected internal error occurred before beginning with any business logic.  Details: '+unused.stack));
    return;
  }//-•

  // Now actually do stuff.


  // In this case, we'll just pretend, since this part doesn't matter.
  // (we just wait a few miliseconds, and then send back an array consisting
  // of one item: the `criteria` that was received.)
  setTimeout(function (){
    var fakeResult = [ metadata.criteria ];

    // Note that, as a way for our test cases to instrument the outcome,
    // we check `metadata.criteria` here, and if it happens to be `false`
    // or `null`, then we trigger an error instead.
    if (metadata.criteria === false) {
      return finalCb(flaverr('E_SOME_ERROR', new Error('Simulated failure (E_SOME_ERROR)')));
    }
    if (_.isNull(metadata.criteria)) {
      return finalCb(new Error('Simulated failure (catchall / misc. error)'));
    }

    return finalCb(undefined, fakeResult);

  }, 25);

};
