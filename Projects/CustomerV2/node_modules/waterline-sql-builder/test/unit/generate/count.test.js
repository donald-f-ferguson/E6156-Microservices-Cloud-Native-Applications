var Test = require('../../support/test-runner');

describe('Query Generation ::', function() {
  describe('COUNT statements', function() {
    it('should generate a count query', function(done) {
      Test({
        query: {
          count: true,
          from: 'users'
        },
        outcomes: [
          {
            dialect: 'postgresql',
            sql: 'select count(*) from "users"',
            bindings: []
          },
          {
            dialect: 'mysql',
            sql: 'select count(*) from `users`',
            bindings: []
          },
          {
            dialect: 'sqlite3',
            sql: 'select count(*) from "users"',
            bindings: []
          },
          {
            dialect: 'oracle',
            sql: 'select count(*) from "users"',
            bindings: []
          },
          {
            dialect: 'mariadb',
            sql: 'select count(*) from `users`',
            bindings: []
          }
        ]
      }, done);
    });
  });
});
