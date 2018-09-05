// Given a Waterline criteria, convert it to a Waterline query.
var assert = require('assert');
var Converter = require('../../lib/query/converter');

module.exports = function(test) {
  var criteria = test.criteria;
  var joins = test.joins;
  var query = test.query;

  if (!criteria || !query) {
    throw new Error('Missing test case.');
  }

  var result = Converter({
    model: criteria.model,
    method: criteria.method,
    criteria: criteria.criteria || {},
    joins: joins || [],
    values: criteria.values || {}
  });

  assert.deepEqual(result, query);
};
