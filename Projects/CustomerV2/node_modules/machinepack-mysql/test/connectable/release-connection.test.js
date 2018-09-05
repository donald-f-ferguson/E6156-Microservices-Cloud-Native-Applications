var assert = require('assert');
var Pack = require('../../');

describe('Connectable ::', function() {
  describe('Release Connection', function() {
    var manager;
    var connection;

    // Create a manager and connection
    before(function(done) {
      // Needed to dynamically get the host using the docker container
      var host = process.env.MYSQL_PORT_3306_TCP_ADDR || 'localhost';

      Pack.createManager({
        connectionString: 'mysql://mp:mp@' + host + ':3306/mppg'
      })
      .exec(function(err, report) {
        if (err) {
          return done(err);
        }

        manager = report.manager;

        Pack.getConnection({
          manager: manager
        })
        .exec(function(err, report) {
          if (err) {
            return done(err);
          }

          connection = report.connection;
          return done();
        });
      });
    });

    it('should successfully release a connection', function(done) {
      // Grab the number of free connections before releasing the current one
      var freeConnectionsPreRelease = manager.pool._freeConnections.length;

      // Release the connection
      Pack.releaseConnection({
        connection: connection
      })
      .exec(function(err) {
        if (err) {
          return done(err);
        }

        // If the connection was successfully released the _allConnections and the
        // _freeConnections should be equal.
        // https://github.com/mysqljs/mysql/blob/master/lib/Pool.js
        var poolSize = manager.pool._allConnections.length;
        var freeConnectionsPostRelease = manager.pool._freeConnections.length;

        // Ensure we end up with different counts after releasing the connection
        assert.notEqual(freeConnectionsPostRelease, freeConnectionsPreRelease);

        // Ensure that all the available connections are free
        assert.equal(poolSize, freeConnectionsPostRelease);

        return done();
      });
    });
  });
});
