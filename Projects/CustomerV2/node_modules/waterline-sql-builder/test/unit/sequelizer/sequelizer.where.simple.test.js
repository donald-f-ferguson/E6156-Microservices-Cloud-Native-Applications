var Sequelizer = require('../../../index')({ dialect: 'postgres' }).sequelizer;
var analyze = require('../../support/analyze');
var assert = require('assert');

describe('Sequelizer ::', function() {
  describe('WHERE Simple statements', function() {
    it('should generate a query with a simple WHERE statement', function() {
      var tree = analyze({
        select: ['id'],
        where: {
          and: [
            {
              firstName: 'Test'
            },
            {
              lastName: 'User'
            }
          ]
        },
        from: 'users'
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select "id" from "users" where "firstName" = $1 and "lastName" = $2');
      assert.deepEqual(result.bindings, ['Test', 'User']);
    });

    it('should generate a valid query when operators are used', function() {
      var tree = analyze({
        select: ['*'],
        where: {
          and: [
            {
              votes: {
                '>': 100
              }
            }
          ]
        },
        from: 'users'
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select * from "users" where "votes" > $1');
      assert.deepEqual(result.bindings, ['100']);
    });

    it('should generate a valid query when multiple columns and operators are used', function() {
      var tree = analyze({
        select: ['*'],
        where: {
          and: [
            {
              votes: {
                '>': 100
              }
            },
            {
              age: {
                '<': 50
              }
            }
          ]
        },
        from: 'users'
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select * from "users" where "votes" > $1 and "age" < $2');
      assert.deepEqual(result.bindings, ['100', '50']);
    });
  });
});
