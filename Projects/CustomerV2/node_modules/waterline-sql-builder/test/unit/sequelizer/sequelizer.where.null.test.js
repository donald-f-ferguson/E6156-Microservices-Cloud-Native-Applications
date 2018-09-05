var Sequelizer = require('../../../index')({ dialect: 'postgres' }).sequelizer;
var analyze = require('../../support/analyze');
var assert = require('assert');

describe('Sequelizer ::', function() {
  describe('WHERE NULL statements', function() {
    it('should generate a query with a simple WHERE statement', function() {
      var tree = analyze({
        select: ['*'],
        from: 'users',
        where: {
          and: [
            {
              updatedAt: null
            }
          ]
        }
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select * from "users" where "updatedAt" is null');
    });
  });
});
