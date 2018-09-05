/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var flaverr = require('flaverr');
var parley = require('../../');
var helpFind = require('./private/help-find.util');


/**
 * find-but-with-timeout.fixture.js
 *
 * A simplified mock of Waterline's `find()` model method -- but with an extremely short timeout.
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
module.exports = function findButWithTimeout( /* variadic */ ){

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
  }, 2);

};
