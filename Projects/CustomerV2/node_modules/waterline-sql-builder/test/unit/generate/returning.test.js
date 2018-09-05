var Test = require('../../support/test-runner');

describe('Query Generation ::', function() {
  describe('RETURNING statements', function() {
    it('should generate an returning query', function(done) {
      Test({
        query: {
          insert: {
            title: 'Slaughterhouse Five'
          },
          into: 'books',
          returning: 'author'
        },
        outcomes: [
          {
            dialect: 'postgresql',
            sql: 'insert into "books" ("title") values ($1) returning "author"',
            bindings: ['Slaughterhouse Five']
          },
          {
            dialect: 'mysql',
            sql: 'insert into `books` (`title`) values (?)',
            bindings: ['Slaughterhouse Five']
          },
          {
            dialect: 'sqlite3',
            sql: 'insert into "books" ("title") values (?)',
            bindings: ['Slaughterhouse Five']
          },
          {
            dialect: 'oracle',
            sql: 'insert into "books" ("title") values (:1) returning ROWID into :2',
            bindings: ['Slaughterhouse Five', { 'columnName': 'author' }]
          },
          {
            dialect: 'mariadb',
            sql: 'insert into `books` (`title`) values (?)',
            bindings: ['Slaughterhouse Five']
          }
        ]
      }, done);
    });

    it('should generate a returning query when using multiple values', function(done) {
      Test({
        query: {
          insert: {
            title: 'Slaughterhouse Five',
            author: 'Kurt Vonnegut'
          },
          into: 'books',
          returning: ['author', 'title']
        },
        outcomes: [
          {
            dialect: 'postgresql',
            sql: 'insert into "books" ("author", "title") values ($1, $2) returning "author", "title"',
            bindings: ['Kurt Vonnegut', 'Slaughterhouse Five']
          },
          {
            dialect: 'mysql',
            sql: 'insert into `books` (`author`, `title`) values (?, ?)',
            bindings: ['Kurt Vonnegut', 'Slaughterhouse Five']
          },
          {
            dialect: 'sqlite3',
            sql: 'insert into "books" ("author", "title") values (?, ?)',
            bindings: ['Kurt Vonnegut', 'Slaughterhouse Five']
          },
          {
            dialect: 'oracle',
            sql: 'insert into "books" ("author", "title") values (:1, :2) returning ROWID into :3',
            bindings: ['Kurt Vonnegut', 'Slaughterhouse Five', { 'columnName': 'author:title' }]
          },
          {
            dialect: 'mariadb',
            sql: 'insert into `books` (`author`, `title`) values (?, ?)',
            bindings: ['Kurt Vonnegut', 'Slaughterhouse Five']
          }
        ]
      }, done);
    });

    it('should generate an returning query returning all values if possible', function(done) {
      Test({
        query: {
          insert: {
            title: 'Slaughterhouse Five'
          },
          into: 'books',
          returning: '*'
        },
        outcomes: [
          {
            dialect: 'postgresql',
            sql: 'insert into "books" ("title") values ($1) returning *',
            bindings: ['Slaughterhouse Five']
          },
          {
            dialect: 'mysql',
            sql: 'insert into `books` (`title`) values (?)',
            bindings: ['Slaughterhouse Five']
          },
          {
            dialect: 'sqlite3',
            sql: 'insert into "books" ("title") values (?)',
            bindings: ['Slaughterhouse Five']
          },
          {
            dialect: 'oracle',
            sql: 'insert into "books" ("title") values (:1) returning ROWID into :2',
            bindings: ['Slaughterhouse Five', { 'columnName': '*' }]
          },
          {
            dialect: 'mariadb',
            sql: 'insert into `books` (`title`) values (?)',
            bindings: ['Slaughterhouse Five']
          }
        ]
      }, done);
    });
  });
});
