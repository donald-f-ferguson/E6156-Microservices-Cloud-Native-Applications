var Sequelizer = require('../../../index')({ dialect: 'postgres' }).sequelizer;
var analyze = require('../../support/analyze');
var assert = require('assert');

describe('Sequelizer ::', function() {
  describe('RETURNING statements', function() {
    it('should generate a simple query with a RETURNING statement', function() {
      var tree = analyze({
        insert: {
          title: 'Slaughterhouse Five'
        },
        into: 'books',
        returning: 'author'
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'insert into "books" ("title") values ($1) returning "author"');
      assert.deepEqual(result.bindings, ['Slaughterhouse Five']);
    });

    it('should generate a query with multiple values being returned', function() {
      var tree = analyze({
        insert: {
          title: 'Slaughterhouse Five',
          author: 'Kurt Vonnegut'
        },
        into: 'books',
        returning: ['author', 'title']
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'insert into "books" ("author", "title") values ($1, $2) returning "author", "title"');
      assert.deepEqual(result.bindings, ['Kurt Vonnegut', 'Slaughterhouse Five']);
    });

    it('should generate a query with all values being returned', function() {
      var tree = analyze({
        insert: {
          title: 'Slaughterhouse Five',
          author: 'Kurt Vonnegut'
        },
        into: 'books',
        returning: '*'
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'insert into "books" ("author", "title") values ($1, $2) returning *');
      assert.deepEqual(result.bindings, ['Kurt Vonnegut', 'Slaughterhouse Five']);
    });
  });
});
