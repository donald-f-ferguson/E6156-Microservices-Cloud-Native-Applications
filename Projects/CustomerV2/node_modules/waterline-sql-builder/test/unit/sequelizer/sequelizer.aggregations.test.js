var Sequelizer = require('../../../index')({ dialect: 'postgres' }).sequelizer;
var analyze = require('../../support/analyze');
var assert = require('assert');

describe('Sequelizer ::', function() {
  describe('Aggregations', function() {
    it('should generate a SUM query', function() {
      var tree = analyze({
        sum: 'active',
        from: 'users'
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select sum("active") from "users"');
    });

    it('should generate a AVG query', function() {
      var tree = analyze({
        avg: 'active',
        from: 'users'
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select avg("active") from "users"');
    });
  });
});
