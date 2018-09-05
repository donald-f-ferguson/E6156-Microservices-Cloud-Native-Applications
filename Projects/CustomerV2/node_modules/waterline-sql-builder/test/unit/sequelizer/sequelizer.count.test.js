var Sequelizer = require('../../../index')({ dialect: 'postgres' }).sequelizer;
var analyze = require('../../support/analyze');
var assert = require('assert');

describe('Sequelizer ::', function() {
  describe('COUNT statements', function() {
    it('should generate a count query', function() {
      var tree = analyze({
        count: true,
        from: 'users'
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select count(*) from "users"');
    });
  });
});
