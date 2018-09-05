var Test = require('../../support/test-runner');

describe('Query Generation ::', function() {
  describe('WHERE NOT EQUAL statements', function() {
    it('should generate a query with a WHERE NOT EQUAL statement', function(done) {
      Test({
        query: {
          select: ['id'],
          from: 'users',
          where: {
            and: [
              {
                firstName: {
                  '!=': 'Test'
                }
              },
              {
                lastName: {
                  '!=': 'User'
                }
              }
            ]
          }
        },
        outcomes: [
          {
            dialect: 'postgresql',
            sql: 'select "id" from "users" where "firstName" != $1 and "lastName" != $2',
            bindings: ['Test', 'User']
          },
          {
            dialect: 'mysql',
            sql: 'select `id` from `users` where `firstName` != ? and `lastName` != ?',
            bindings: ['Test', 'User']
          },
          {
            dialect: 'sqlite3',
            sql: 'select "id" from "users" where "firstName" != ? and "lastName" != ?',
            bindings: ['Test', 'User']
          },
          {
            dialect: 'oracle',
            sql: 'select "id" from "users" where "firstName" != :1 and "lastName" != :2',
            bindings: ['Test', 'User']
          },
          {
            dialect: 'mariadb',
            sql: 'select `id` from `users` where `firstName` != ? and `lastName` != ?',
            bindings: ['Test', 'User']
          }
        ]
      }, done);
    });

    it('should generate a query when nested WHERE NOT statements are used', function(done) {
      Test({
        query: {
          select: '*',
          from: 'users',
          where: {
            or: [
              {
                or: [
                  {
                    id: {
                      '!=': 1
                    }
                  },
                  {
                    id: {
                      '<': 10
                    }
                  }
                ]
              },
              {
                name: {
                  '!=': 'Tester'
                }
              }
            ]
          }
        },
        outcomes: [
          {
            dialect: 'postgresql',
            sql: 'select * from "users" where ("id" != $1 or "id" < $2) or "name" != $3',
            bindings: ['1', '10', 'Tester']
          },
          {
            dialect: 'mysql',
            sql: 'select * from `users` where (`id` != ? or `id` < ?) or `name` != ?',
            bindings: ['1', '10', 'Tester']
          },
          {
            dialect: 'sqlite3',
            sql: 'select * from "users" where ("id" != ? or "id" < ?) or "name" != ?',
            bindings: ['1', '10', 'Tester']
          },
          {
            dialect: 'oracle',
            sql: 'select * from "users" where ("id" != :1 or "id" < :2) or "name" != :3',
            bindings: ['1', '10', 'Tester']
          },
          {
            dialect: 'mariadb',
            sql: 'select * from `users` where (`id` != ? or `id` < ?) or `name` != ?',
            bindings: ['1', '10', 'Tester']
          }
        ]
      }, done);
    });

    it('should generate a query when multiple operators are used', function(done) {
      Test({
        query: {
          select: ['*'],
          from: 'users',
          where: {
            or: [
              { name: 'John' },
              {
                votes: { '>': 100 },
                title: {
                  '!=': 'Admin'
                }
              }
            ]
          }
        },
        outcomes: [
          {
            dialect: 'postgresql',
            sql: 'select * from "users" where "name" = $1 or ("votes" > $2 and "title" != $3)',
            bindings: ['John', '100', 'Admin']
          },
          {
            dialect: 'mysql',
            sql: 'select * from `users` where `name` = ? or (`votes` > ? and `title` != ?)',
            bindings: ['John', '100', 'Admin']
          },
          {
            dialect: 'sqlite3',
            sql: 'select * from "users" where "name" = ? or ("votes" > ? and "title" != ?)',
            bindings: ['John', '100', 'Admin']
          },
          {
            dialect: 'oracle',
            sql: 'select * from "users" where "name" = :1 or ("votes" > :2 and "title" != :3)',
            bindings: ['John', '100', 'Admin']
          },
          {
            dialect: 'mariadb',
            sql: 'select * from `users` where `name` = ? or (`votes` > ? and `title` != ?)',
            bindings: ['John', '100', 'Admin']
          }
        ]
      }, done);
    });

    it('should generate a query when an AND array is used', function(done) {
      Test({
        query: {
          select: ['*'],
          from: 'users',
          where: {
            and: [
              {
                name: 'John'
              },
              {
                title: {
                  '!=': 'Admin'
                }
              }
            ]
          }
        },
        outcomes: [
          {
            dialect: 'postgresql',
            sql: 'select * from "users" where "name" = $1 and "title" != $2',
            bindings: ['John', 'Admin']
          },
          {
            dialect: 'mysql',
            sql: 'select * from `users` where `name` = ? and `title` != ?',
            bindings: ['John', 'Admin']
          },
          {
            dialect: 'sqlite3',
            sql: 'select * from "users" where "name" = ? and "title" != ?',
            bindings: ['John', 'Admin']
          },
          {
            dialect: 'oracle',
            sql: 'select * from "users" where "name" = :1 and "title" != :2',
            bindings: ['John', 'Admin']
          },
          {
            dialect: 'mariadb',
            sql: 'select * from `users` where `name` = ? and `title` != ?',
            bindings: ['John', 'Admin']
          }
        ]
      }, done);
    });
  });
});
