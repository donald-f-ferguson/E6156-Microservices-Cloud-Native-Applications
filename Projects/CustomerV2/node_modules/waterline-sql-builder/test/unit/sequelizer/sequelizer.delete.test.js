var Sequelizer = require('../../../index')({ dialect: 'postgres' }).sequelizer;
var analyze = require('../../support/analyze');
var assert = require('assert');

describe('Sequelizer ::', function() {
  describe('DELETE statements', function() {
    it('should generate a simple query with an DELETE statement', function() {
      var tree = analyze({
        del: true,
        from: 'accounts',
        where: {
          and: [
            {
              activated: false
            }
          ]
        }
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'delete from "accounts" where "activated" = $1');
      assert.deepEqual(result.bindings, [false]);
    });
  });
});
