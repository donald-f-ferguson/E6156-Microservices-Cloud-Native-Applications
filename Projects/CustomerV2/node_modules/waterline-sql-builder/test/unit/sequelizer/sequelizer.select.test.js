var Sequelizer = require('../../../index')({ dialect: 'postgres' }).sequelizer;
var analyze = require('../../support/analyze');
var assert = require('assert');

describe('Sequelizer ::', function() {
  describe('SELECT statements', function() {
    it('should generate a query for select "*"', function() {
      var tree = analyze({
        select: ['*'],
        from: 'books'
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select * from "books"');
    });

    it('should generate a query when defined columns are used', function() {
      var tree = analyze({
        select: ['title', 'author', 'year'],
        from: 'books'
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select "title", "author", "year" from "books"');
    });
  });
});
