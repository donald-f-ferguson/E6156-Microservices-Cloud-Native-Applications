var Pack = require('../../');

describe('Transactional ::', function() {
  describe.skip('Begin Transaction', function() {
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

        // Store the manager
        manager = report.manager;

        Pack.getConnection({
          manager: manager
        })
        .exec(function(err, report) {
          if (err) {
            return done(err);
          }

          // Store the connection
          connection = report.connection;

          return done();
        });
      });
    });

    // Afterwards close the transaction and release the connection
    after(function(done) {
      Pack.sendNativeQuery({
        connection: connection,
        nativeQuery: 'ROLLBACK;'
      })
      .exec(function(err) {
        if (err) {
          return done(err);
        }

        Pack.releaseConnection({
          connection: connection
        }).exec(done);
      });
    });

    // TODO: Find a way to get a transaction id in mysql??
  });
});
