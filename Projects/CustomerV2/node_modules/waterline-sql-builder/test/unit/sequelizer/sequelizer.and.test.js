var Sequelizer = require('../../../index')({ dialect: 'postgres' }).sequelizer;
var analyze = require('../../support/analyze');
var assert = require('assert');

describe('Sequelizer ::', function() {
  describe('Grouping statements with AND', function() {
    it('should generate a query when AND is used as an array', function() {
      var tree = analyze({
        select: '*',
        from: 'users',
        where: {
          and: [
            {
              firstName: 'foo'
            },
            {
              lastName: 'bar'
            }
          ]
        }
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select * from "users" where "firstName" = $1 and "lastName" = $2');
      assert.deepEqual(result.bindings, ['foo', 'bar']);
    });

    it('should generate a query when nested OR statements are used', function() {
      var tree = analyze({
        select: ['*'],
        from: 'users',
        where: {
          and: [
            {
              or: [
                {
                  firstName: 'John'
                },
                {
                  lastName: 'Smith'
                }
              ]
            },
            {
              or: [
                {
                  qty: {
                    '>': 100
                  }
                },
                {
                  price: {
                    '<': 10.01
                  }
                }
              ]
            }
          ]
        }
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select * from "users" where ("firstName" = $1 or "lastName" = $2) and ("qty" > $3 or "price" < $4)');
      assert.deepEqual(result.bindings, ['John', 'Smith', '100', '10.01']);
    });
  });
});
