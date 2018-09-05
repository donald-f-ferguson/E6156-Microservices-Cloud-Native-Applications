var Sequelizer = require('../../../index')({ dialect: 'postgres' }).sequelizer;
var analyze = require('../../support/analyze');
var assert = require('assert');

describe('Sequelizer ::', function() {
  describe('OPTS', function() {
    it('should support schemas', function() {
      var tree = analyze({
        select: ['title', 'author', 'year'],
        from: 'books',
        opts: {
          schema: 'foo'
        }
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'select "title", "author", "year" from "foo"."books"');
    });
  });
});
