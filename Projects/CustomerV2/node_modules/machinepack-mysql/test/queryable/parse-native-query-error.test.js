var assert = require('assert');
var _ = require('@sailshq/lodash');
var Pack = require('../../');

describe('Queryable ::', function() {
  describe('Parse Native Query Error', function() {
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
          Pack.sendNativeQuery({
            connection: connection,
            nativeQuery: 'CREATE TABLE IF NOT EXISTS people(name varchar(255) UNIQUE);'
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

    // Afterwards destroy the test table and release the connection
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

    it('should normalize UNIQUE constraint errors', function(done) {
      // Insert two records with identical names
      Pack.sendNativeQuery({
        connection: connection,
        nativeQuery: 'INSERT INTO people VALUES (\'Batman\'), (\'Batman\');'
      })
      .exec(function(err) {
        assert(err);
        assert.equal(err.exit, 'queryFailed');

        Pack.parseNativeQueryError({
          nativeQueryError: err.raw.error
        })
        .exec(function(err, report) {
          if (err) {
            return done(err);
          }

          assert(report.footprint);
          assert(report.footprint.identity);
          assert.equal(report.footprint.identity, 'notUnique');
          assert(_.isArray(report.footprint.keys));
          assert.equal(report.footprint.keys.length, 1);
          assert.equal(_.first(report.footprint.keys), 'name');

          return done();
        });
      });
    });
  });
});
