var Sequelizer = require('../../../index')({ dialect: 'postgres' }).sequelizer;
var analyze = require('../../support/analyze');
var assert = require('assert');

describe('Sequelizer ::', function() {
  describe('DISTINCT statements', function() {
    it('should generate a distinct query', function() {
      var tree = analyze({
        select: {
          distinct: ['firstName', 'lastName']
        },
        from: 'customers'
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select distinct "firstName", "lastName" from "customers"');
    });
  });
});
