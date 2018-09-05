/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var flaverr = require('flaverr');
var parley = require('../../');
var helpFind = require('./private/help-find.util');


/**
 * find.fixture.js
 *
 * A simplified mock of Waterline's `find()` model method.
 *
 * @param {Dictionary?} criteria
 * @param {Function} explicitCb
 *
 * @returns {Deferred} If no callback specified
 */
module.exports = function find( /* variadic */ ){

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

  // This deferred may or may not actually need to get built.
  // (but in case it does, we define it out here so we can unambiguously
  // return it below)
  //
  // > If an explicit callback was specified, then go ahead
  // > and proceed to where the real action is at.
  // > Otherwise, no callback was specified explicitly,
  // > so we'll build and return a Deferred instead.
  var deferred = parley(function (deferredCb){
    helpFind(undefined, metadata, deferredCb);
  }, explicitCb);


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
  _.extend(deferred, {
    where: function(clause) {
      metadata.criteria = metadata.criteria || {};
      metadata.criteria.where = clause;
      return deferred;
    }
  });

  // When we're confident that our Deferred is ready for primetime,
  // we finish up by returning it.
  return deferred;

};
