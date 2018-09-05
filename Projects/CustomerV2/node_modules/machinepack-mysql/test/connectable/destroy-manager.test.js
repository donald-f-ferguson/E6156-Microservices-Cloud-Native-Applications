var assert = require('assert');
var Pack = require('../../');

describe('Connectable ::', function() {
  describe('Destroy Manager', function() {
    var manager;

    // Create a manager
    before(function(done) {
      Pack.createManager({
        connectionString: 'mysql://mp:mp@localhost:3306/mppg'
      })
      .exec(function(err, report) {
        if (err) {
          return done(err);
        }

        manager = report.manager;
        return done();
      });
    });


    it('should successfully destroy the manager', function(done) {
      Pack.destroyManager({
        manager: manager
      })
      .exec(function(err) {
        assert(!err);
        return done();
      });
    });
  });
});
