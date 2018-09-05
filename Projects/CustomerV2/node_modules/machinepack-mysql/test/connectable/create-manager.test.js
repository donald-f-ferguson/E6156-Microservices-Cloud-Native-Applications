var assert = require('assert');
var Pack = require('../../');

describe('Connectable ::', function() {
  describe('Create Manager', function() {
    it('should work without a protocol in the connection string', function(done) {
      Pack.createManager({
        connectionString: 'localhost:3306/mppg'
      })
      .exec(function(err) {
        if (err) {
          return done(err);
        }
        return done();
      });
    });

    it('should successfully return a Pool', function(done) {
      Pack.createManager({
        connectionString: 'mysql://mp:mp@localhost:3306/mppg'
      })
      .exec(function(err, report) {
        if (err) {
          return done(err);
        }

        // Assert that the manager has a pool object
        assert(report.manager.pool);

        // Assert that the manager has a getConnection function
        assert(report.manager.pool.getConnection);

        return done();
      });
    });
  });
});
