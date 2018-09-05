var assert = require('assert');
var Pack = require('../../');

describe('Transactional ::', function() {
  describe('Rollback Transaction', function() {
    var manager;
    var connection;

    // Create a manager, a connection, and a table
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
          Pack.sendNativeQuery({
            connection: connection,
            nativeQuery: 'CREATE TABLE IF NOT EXISTS people(id serial primary key, name varchar(255));'
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

    // Afterwards destroy the table and release the connection
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

    // To Test:
    // * Open a transaction on connection and insert a record into the DB
    // * Run a query on connection and make sure the record exist
    // * Rollback the transaction
    // * Run the select query again and the record should not exist
    it('should perform a transaction and make sure the results are rolled back correctly', function(done) {
      // Start a transaction
      Pack.beginTransaction({
        connection: connection
      })
      .exec(function(err) {
        if (err) {
          return done(err);
        }

        // Insert a record using the transaction
        Pack.sendNativeQuery({
          connection: connection,
          nativeQuery: 'INSERT INTO people (name) VALUES (\'hugo\');'
        })
        .exec(function(err) {
          if (err) {
            return done(err);
          }

          // Query the table and ensure the record does exist
          Pack.sendNativeQuery({
            connection: connection,
            nativeQuery: 'SELECT * FROM people;'
          })
          .exec(function(err, report) {
            if (err) {
              return done(err);
            }

            // Ensure 1 result were returned
            assert.equal(report.result.rows.length, 1);

            // Rollback the transaction
            Pack.rollbackTransaction({
              connection: connection
            })
            .exec(function(err) {
              if (err) {
                return done(err);
              }

              // Query the table using and ensure the record doesn't exist
              Pack.sendNativeQuery({
                connection: connection,
                nativeQuery: 'SELECT * FROM people;'
              })
              .exec(function(err, report) {
                if (err) {
                  return done(err);
                }

                // Ensure no results were returned
                assert.equal(report.result.rows.length, 0);

                return done();
              });
            });
          });
        });
      });
    });
  });
});
