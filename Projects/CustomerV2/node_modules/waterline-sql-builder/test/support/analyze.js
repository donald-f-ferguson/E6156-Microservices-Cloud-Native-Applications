/**
 * Given a criteria format, return the analyzed version.
 * For use with Sequelizer tests.
 */

var Utils = require('waterline-utils');

module.exports = function(expression) {
  var tokens = Utils.query.tokenizer(expression);
  var tree = Utils.query.analyzer(tokens);
  return tree;
};
