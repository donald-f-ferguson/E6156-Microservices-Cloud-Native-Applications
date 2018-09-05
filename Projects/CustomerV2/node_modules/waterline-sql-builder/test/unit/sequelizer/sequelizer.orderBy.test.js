var Sequelizer = require('../../../index')({ dialect: 'postgres' }).sequelizer;
var analyze = require('../../support/analyze');
var assert = require('assert');

describe('Sequelizer ::', function() {
  describe('ORDER BY statements', function() {
    it('should generate a simple query with ORDER BY statements', function() {
      var tree = analyze({
        select: ['*'],
        from: 'users',
        orderBy: [
          {
            name: 'desc'
          },
          {
            age: 'asc'
          }
        ]
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select * from "users" order by "name" desc, "age" asc');
    });
  });
});
