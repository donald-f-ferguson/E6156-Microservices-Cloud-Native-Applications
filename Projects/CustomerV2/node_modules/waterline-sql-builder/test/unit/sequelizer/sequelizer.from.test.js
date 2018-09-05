var Sequelizer = require('../../../index')({ dialect: 'postgres' }).sequelizer;
var analyze = require('../../support/analyze');
var assert = require('assert');

describe('Sequelizer ::', function() {
  describe('FROM statements', function() {
    it('should generate a simple query with a FROM statement', function() {
      var tree = analyze({
        select: ['*'],
        from: 'books'
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select * from "books"');
    });
  });
});
