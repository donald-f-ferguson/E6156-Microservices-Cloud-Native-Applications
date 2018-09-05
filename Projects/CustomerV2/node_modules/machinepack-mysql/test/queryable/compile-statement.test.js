var assert = require('assert');
var Pack = require('../../');

describe('Queryable ::', function() {
  describe('Compile Statement', function() {
    it('should generate a SQL Statement from a WLQL query', function(done) {
      Pack.compileStatement({
        statement: {
          select: ['title', 'author', 'year'],
          from: 'books'
        }
      })
      .exec(function(err, report) {
        if (err) {
          return done(err);
        }

        assert.equal(report.nativeQuery, 'select `title`, `author`, `year` from `books`');
        return done();
      });
    });

    // FUTURE: Add lots of checking to the statement compiler
    it.skip('should return the malformed exit for bad WLQL', function(done) {
      Pack.compileStatement({
        statement: {
          foo: 'bar',
          from: 'books'
        }
      })
      .exec(function(err) {
        try {
          assert(err);
          assert.equal(err.exit, 'malformed', 'Instead got '+err.stack);
        } catch (err2) { return done(err2); }

        return done();
      });
    });
  });
});
