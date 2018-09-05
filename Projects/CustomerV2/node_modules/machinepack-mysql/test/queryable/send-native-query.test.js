var assert = require('assert');
var _ = require('@sailshq/lodash');
var Pack = require('../../');

describe('Queryable ::', function() {
  describe('Send Native Query', function() {
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

          // Create a table to use for testing
          // Uses sendNativeQuery but doesn't get rows or anything.
          // TODO: figure out a query that can run with the given permissions
          // that doesn't need an additional table
          Pack.sendNativeQuery({
            connection: connection,
            nativeQuery: 'CREATE TABLE IF NOT EXISTS people(name varchar(255));'
          })
          .exec(function(err) {
            if (err) {
              return done(err);
            }

            return done();
          });
        });
      });
    });

    // Afterwards release the connection
    after(function(done) {
      Pack.sendNativeQuery({
        connection: connection,
        nativeQuery: 'DROP TABLE people;'
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

    it('should run a native query and return the reports', function(done) {
      Pack.sendNativeQuery({
        connection: connection,
        nativeQuery: 'select * from people;'
      })
      .exec(function(err, report) {
        if (err) {
          return done(err);
        }

        assert(_.isArray(report.result.rows));

        return done();
      });
    });
  });
});
