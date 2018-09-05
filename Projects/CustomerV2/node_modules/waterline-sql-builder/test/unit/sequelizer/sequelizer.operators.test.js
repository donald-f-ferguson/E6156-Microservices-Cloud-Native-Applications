var Sequelizer = require('../../../index')({ dialect: 'postgres' }).sequelizer;
var analyze = require('../../support/analyze');
var assert = require('assert');

describe('Sequelizer ::', function() {
  describe('Various Operators', function() {
    it('should generate a query for LIKE operators', function() {
      var tree = analyze({
        select: ['*'],
        from: 'users',
        where: {
          or: [
            {
              name: {
                like: '%Test%'
              }
            },
            {
              id: {
                nin: [1, 2, 3]
              }
            }
          ]
        }
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select * from "users" where "name" like $1 or "id" not in ($2, $3, $4)');
      assert.deepEqual(result.bindings, ['%Test%', '1', '2', '3']);
    });

    it('should generate a query for != operators', function() {
      var tree = analyze({
        select: ['id'],
        from: 'users',
        where: {
          and: [
            {
              firstName: {
                '!=': 'Test'
              }
            },
            {
              lastName: {
                '!=': 'User'
              }
            }
          ]
        }
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select "id" from "users" where "firstName" != $1 and "lastName" != $2');
      assert.deepEqual(result.bindings, ['Test', 'User']);
    });

    it('should generate a query with nested WHERE NOT EQUAL statements', function() {
      var tree = analyze({
        select: ['*'],
        from: 'users',
        where: {
          or: [
            {
              or: [
                {
                  id: {
                    '!=': 1
                  }
                },
                {
                  id: {
                    '<': 10
                  }
                }
              ]
            },
            {
              name: {
                '!=': 'Tester'
              }
            }
          ]
        }
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select * from "users" where ("id" != $1 or "id" < $2) or "name" != $3');
      assert.deepEqual(result.bindings, ['1', '10', 'Tester']);
    });

    it('should generate a query for != null operators', function() {
      var tree = analyze({
        select: ['id'],
        from: 'users',
        where: {
          and: [
            {
              firstName: {
                '!=': null
              }
            },
            {
              lastName: {
                '!=': 'User'
              }
            }
          ]
        }
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select "id" from "users" where "firstName" is not null and "lastName" != $1');
      assert.deepEqual(result.bindings, ['User']);
    });

    it('should generate a query when multiple operators are used', function() {
      var tree = analyze({
        select: ['*'],
        from: 'users',
        where: {
          or: [
            {
              name: 'John'
            },
            {
              votes: {
                '>': 100
              },
              title: {
                '!=': 'Admin'
              }
            }
          ]
        }
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select * from "users" where "name" = $1 or ("votes" > $2 and "title" != $3)');
      assert.deepEqual(result.bindings, ['John', '100', 'Admin']);
    });
  });
});
