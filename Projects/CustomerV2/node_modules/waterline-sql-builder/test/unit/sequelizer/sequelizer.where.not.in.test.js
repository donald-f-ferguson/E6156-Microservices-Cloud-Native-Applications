var Sequelizer = require('../../../index')({ dialect: 'postgres' }).sequelizer;
var analyze = require('../../support/analyze');
var assert = require('assert');

describe('Sequelizer ::', function() {
  describe('WHERE NOT IN statements', function() {
    it('should generate a query', function() {
      var tree = analyze({
        select: ['name'],
        from: 'users',
        where: {
          and: [
            {
              id: {
                nin: [1, 2, 3]
              }
            }
          ]
        }
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select "name" from "users" where "id" not in ($1, $2, $3)');
      assert.deepEqual(result.bindings, ['1', '2', '3']);
    });

    it('should generate a query when used in a conjunction', function() {
      var tree = analyze({
        select: ['name'],
        from: 'users',
        where: {
          and: [
            {
              id: {
                nin: [1, 2, 3]
              },
              age: {
                nin: [30, 40, 50]
              }
            }
          ]
        }
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select "name" from "users" where ("id" not in ($1, $2, $3) and "age" not in ($4, $5, $6))');
      assert.deepEqual(result.bindings, ['1', '2', '3', '30', '40', '50']);
    });

    it('should generate a query when in an OR statement', function() {
      var tree = analyze({
        select: ['name'],
        from: 'users',
        where: {
          or: [
            {
              id: {
                nin: [1, 2, 3]
              }
            },
            {
              id: {
                nin: [4, 5, 6]
              }
            }
          ]
        }
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select "name" from "users" where "id" not in ($1, $2, $3) or "id" not in ($4, $5, $6)');
      assert.deepEqual(result.bindings, ['1', '2', '3', '4', '5', '6']);
    });

    it('should generate a query when in an OR statement with multiple criteria', function() {
      var tree = analyze({
        select: ['name'],
        from: 'users',
        where: {
          or: [
            {
              and: [
                {
                  id: {
                    nin: [1, 2, 3]
                  }
                },
                {
                  age: 21
                }
              ]
            },
            {
              id: {
                nin: [4, 5, 6]
              }
            }
          ]
        }
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select "name" from "users" where ("id" not in ($1, $2, $3) and "age" = $4) or "id" not in ($5, $6, $7)');
      assert.deepEqual(result.bindings, ['1', '2', '3', '21', '4', '5', '6']);
    });
  });
});
