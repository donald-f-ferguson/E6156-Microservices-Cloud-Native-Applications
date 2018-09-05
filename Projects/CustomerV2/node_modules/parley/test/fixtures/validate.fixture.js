/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var parley = require('../../');


/**
 * validate.fixture.js
 *
 * A simplified mock of a hypothetical `validate()` model method
 * that is actually synchronous.  (This is primarily for use in benchmarks.)
 *
 * @param {Function} explicitCbMaybe
 *
 * @returns {Deferred} If no callback specified
 */
module.exports = function validate(explicitCbMaybe){

  var metadata = {};

  // This deferred may or may not actually need to get built.
  // (but in case it does, we define it out here so we can unambiguously
  // return it below)
  var deferred;


  // If an explicit callback was specified, then go ahead
  // and proceed to where the real action is at.
  // Otherwise, no callback was specified explicitly,
  // so we'll build and return a Deferred instead.
  deferred = parley(function (finalCb){

    // Now actually do stuff.
    // ...except actually don't-- this is just pretend.

    // All done.
    return finalCb();

  }, explicitCbMaybe);


  // If we ended up building a Deferred above, we would have done so synchronously.
  // In other words, if there's going to be a Deferred, we have it here.
  //
  // So if we DON'T have a Deferred, then we know that we must have already went ahead
  // and performed our business logic.  So we'll just return undefined.
  if (!deferred) {
    return;
  }//-•


  // IWMIH, then we know we have a Deferred.
  // (and thus we haven't actually done anything yet.)

  // At this point, we might opt to attach some methods to our Deferred.
  // --(1)-------------------------------------------------------
  // --too slow:
  // --(e.g. 212k ops/sec)
  // deferred.meta = function (_meta){
  //   metadata.meta = _meta;
  //   return deferred;
  // };
  // --(2)-------------------------------------------------------
  // --perfectly fast, but doesn't do anything:
  // --(e.g. 373k ops/sec)
  // var theMeta = function (_meta){
  //   metadata.meta = _meta;
  //   return deferred;
  // };
  // --(3)-------------------------------------------------------
  // --somewhat better than the original!!...
  // --(e.g. 273k ops/sec)
  // --....but problematic, because it doesn't actually mutate
  // --the original deferred, which could cause inconsistencies.
  // deferred = _.extend({
  //   meta: function (_meta){
  //     metadata.meta = _meta;
  //     return deferred;
  //   }
  // }, deferred);
  // --(4)-------------------------------------------------------
  // --considerably better than the original!!
  // --(Even more than #3... plus it's totally valid!)
  // --(e.g. ~268k-292k ops/sec)
  _.extend(deferred, {
    meta: function (_meta){
      metadata.meta = _meta;
      return deferred;
    },
    // Uncomment these methods for testing performance:
    // (this function gets slower and slower the more you add dynamically like this)
    // ================================================================================================
    // a: function (beep, boop) { console.log(Math.random()+'hi0'); return deferred; },
    // b: function (baa, baaa, black, sheep) { console.log(Math.random()+'hi1'); return deferred; },
    // c: function (beep, boop) { console.log(Math.random()+'hi2'); return deferred; },
    // d: function (baa, baaa, black, sheep) { console.log(Math.random()+'hi3'); return deferred; },
    // e: function (beep, boop) { console.log(Math.random()+'hi5'); return deferred; },
    // f: function (baa, baaa, black, sheep) { console.log(Math.random()+'hi5'); return deferred; },
    // g: function (beep, boop) { console.log(Math.random()+'hi6'); return deferred; },
    // h: function (baa, baaa, black, sheep) { console.log(Math.random()+'hi7'); return deferred; },
    // i: function (beep, boop) { console.log(Math.random()+'hi8'); return deferred; },
    // j: function (baa, baaa, black, sheep) { console.log(Math.random()+'hi9'); return deferred; },
    // k: function (beep, boop) { console.log(Math.random()+'hi10'); return deferred; },
    // l: function (baa, baaa, black, sheep) { console.log(Math.random()+'hi11'); return deferred; },
    // ================================================================================================
  });

  // When we're confident that our Deferred is ready for primetime,
  // we finish up by returning it.
  return deferred;

};

