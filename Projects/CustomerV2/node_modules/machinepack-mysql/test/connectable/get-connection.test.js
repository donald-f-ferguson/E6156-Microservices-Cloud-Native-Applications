var assert = require('assert');
var Pack = require('../../');

describe('Connectable ::', function() {
  describe('Get Connection', function() {
    var manager;

    // Create a manager
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
        return done();
      });
    });

    it('should successfully return a connection instance', function(done) {
      Pack.getConnection({
        manager: manager
      })
      .exec(function(err, report) {
        if (err) {
          return done(err);
        }

        // Assert that the report has a client object
        assert(report.connection);

        // Assert that the connection has a release function
        assert(report.connection.release);

        return done();
      });
    });
  });
});
