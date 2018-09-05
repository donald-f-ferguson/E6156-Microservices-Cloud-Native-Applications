/**
 * Given a criteria format, return the tokenized version.
 * For use with Analyzer tests.
 */

var Tokenizer = require('../../index').query.tokenizer;

module.exports = function(expression) {
  return Tokenizer(expression);
};
