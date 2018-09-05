var Sequelizer = require('../../../index')({ dialect: 'postgres' }).sequelizer;
var analyze = require('../../support/analyze');
var assert = require('assert');

describe('Sequelizer ::', function() {
  describe('WHERE IN statements', function() {
    it('should generate a query', function() {
      var tree = analyze({
        select: ['name'],
        from: 'users',
        where: {
          and: [
            {
              id: {
                in: [1, 2, 3]
              }
            }
          ]
        }
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select "name" from "users" where "id" in ($1, $2, $3)');
      assert.deepEqual(result.bindings, ['1', '2', '3']);
    });

    it('should generate a query when in an OR statement', function() {
      var tree = analyze({
        select: ['name'],
        from: 'users',
        where: {
          or: [
            {
              id: {
                in: [1, 2, 3]
              }
            },
            {
              id: {
                in: [4, 5, 6]
              }
            }
          ]
        }
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select "name" from "users" where "id" in ($1, $2, $3) or "id" in ($4, $5, $6)');
      assert.deepEqual(result.bindings, ['1', '2', '3', '4', '5', '6']);
    });
  });
});
