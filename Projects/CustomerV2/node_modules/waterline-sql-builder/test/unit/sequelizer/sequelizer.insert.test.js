var Sequelizer = require('../../../index')({ dialect: 'postgres' }).sequelizer;
var analyze = require('../../support/analyze');
var assert = require('assert');

describe('Sequelizer ::', function() {
  describe('INSERT statements', function() {
    it('should generate a simple query with an INSERT statement', function() {
      var tree = analyze({
        insert: {
          title: 'Slaughterhouse Five'
        },
        into: 'books'
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'insert into "books" ("title") values ($1)');
      assert.deepEqual(result.bindings, ['Slaughterhouse Five']);
    });

    it('should generate a query with multiple values being inserted', function() {
      var tree = analyze({
        insert: {
          title: 'Slaughterhouse Five',
          author: 'Kurt Vonnegut'
        },
        into: 'books'
      });

      var result = Sequelizer(tree);
      assert.equal(result.sql, 'insert into "books" ("author", "title") values ($1, $2)');
      assert.deepEqual(result.bindings, ['Kurt Vonnegut', 'Slaughterhouse Five']);
    });

    it('should generate a query with an array of values being inserted', function() {
      var tree = analyze({
        insert: [
          {
            title: 'Slaughterhouse Five',
            author: 'Kurt Vonnegut'
          },
          {
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald'
          }
        ],
        into: 'books'
      });

      var result = Sequelizer(tree);

      assert.equal(result.sql, 'insert into "books" ("author", "title") values ($1, $2), ($3, $4)');
      assert.deepEqual(result.bindings, ['Kurt Vonnegut', 'Slaughterhouse Five', 'F. Scott Fitzgerald', 'The Great Gatsby']);
    });
  });
});
