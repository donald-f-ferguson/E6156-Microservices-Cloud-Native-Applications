/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var flaverr = require('flaverr');
var parley = require('../../');
var helpFind = require('./private/help-find.util');


/**
 * find-but-with-final-after-exec-lc.fixture.js
 *
 * A simplified/fake mock of Waterline's `find()` model method --
 * but using a lifecycle callback to do some weird stuff.
 *
 * > See `find.fixture.js` for more info.  Many comments were removed from the code below
 * > to avoid unnecessary duplication and reduce the chances of things getting weird.
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * @param {Dictionary?} criteria
 * @param {Function} explicitCb
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * @returns {Deferred} If no callback specified
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 */
module.exports = function findButWithFinalAfterExecLC( /* variadic */ ){

  var metadata = {};

  var explicitCb;

  // Handle variadic usage:
  // ===========================================================================
  if (!_.isUndefined(arguments[0])) {
    if (_.isFunction(arguments[0])) {
      explicitCb = arguments[0];
    }
    else {
      metadata.criteria = arguments[0];
    }
  }//>-

  if (!_.isUndefined(arguments[1])) {
    explicitCb = arguments[1];
  }//>-
  // ===========================================================================

  return parley(function (done){
    helpFind(undefined, metadata, done);
  }, explicitCb, {
    where: function(clause) {
      metadata.criteria = metadata.criteria || {};
      metadata.criteria.where = clause;
      return this;
    }
  }, undefined, undefined, function (err, result){
    // console.log('* * * * running intercept');
    if (err) {
      if (err.code !== 'E_SOME_ERROR') {
        err = flaverr('E_SOME_UNRECOGNIZED_ERROR', new Error(err.message));
        // console.log('* * MUTATED ERROR!');
        return err;
      }//-•
      return err;
    }//-•

    // Unless criteria is `true`, simulate a case where we'd want to change the result.
    // > Note that we could mutate result and return that, or just return the result.
    // > It shouldn't matter!  Same thing for the error above.
    if (metadata.criteria !== true) {
      result.push({ fake: true });
      // console.log('* * MUTATED OUTPUT!');
      return result;
    }//-•
    return result;
  });

};
