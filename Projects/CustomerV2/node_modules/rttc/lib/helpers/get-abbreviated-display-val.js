/**
 * Module dependencies
 */

var util = require('util');
var _ = require('@sailshq/lodash');
var getDisplayType = require('../get-display-type');



/**
 * getAbbreviatedDisplayVal()
 *
 * A helper function that displays a short, human-readable
 * version of a value.  Handy for e.g. legible test output.
 *
 * @param  {===} v
 * @return {String}   [short human-readable display value]
 */
module.exports = function getAbbreviatedDisplayVal(v){

  if (_.isDate(v)) {
    return 'a Date';
  }
  if (_.isFunction(v)) {
    return v.toString();
  }
  if (_.isError(v)) {
    return 'an Error';
  }
  if (_.isRegExp(v)) {
    return 'a RegExp';
  }
  if (!_.isPlainObject(v) && !_.isArray(v)) {
    return getDisplayType(v);
  }
  return util.inspect(v,false,null);
};
