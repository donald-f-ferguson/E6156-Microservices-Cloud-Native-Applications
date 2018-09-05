var Sequelizer = require('../../../index')({ dialect: 'postgres' }).sequelizer;
var analyze = require('../../support/analyze');
var assert = require('assert');

describe('Sequelizer ::', function() {
  describe('SKIP statements', function() {
    it('should generate a simple query with a SKIP statement', function() {
      var tree = analyze({
        select: ['*'],
        from: 'users',
        skip: 10
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select * from "users" offset $1');
      assert.deepEqual(result.bindings, ['10']);
    });
  });
});
