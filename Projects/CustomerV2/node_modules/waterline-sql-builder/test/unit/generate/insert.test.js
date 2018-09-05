var Test = require('../../support/test-runner');

describe('Query Generation ::', function() {
  describe('INSERT statements', function() {
    it('should generate an insert query', function(done) {
      Test({
        query: {
          insert: {
            title: 'Slaughterhouse Five'
          },
          into: 'books'
        },
        outcomes: [
          {
            dialect: 'postgresql',
            sql: 'insert into "books" ("title") values ($1)',
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
            sql: 'insert into "books" ("title") values (:1)',
            bindings: ['Slaughterhouse Five']
          },
          {
            dialect: 'mariadb',
            sql: 'insert into `books` (`title`) values (?)',
            bindings: ['Slaughterhouse Five']
          }
        ]
      }, done);
    });

    it('should generate an insert query when using multiple values', function(done) {
      Test({
        query: {
          insert: {
            title: 'Slaughterhouse Five',
            author: 'Kurt Vonnegut'
          },
          into: 'books'
        },
        outcomes: [
          {
            dialect: 'postgresql',
            sql: 'insert into "books" ("author", "title") values ($1, $2)',
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
            sql: 'insert into "books" ("author", "title") values (:1, :2)',
            bindings: ['Kurt Vonnegut', 'Slaughterhouse Five']
          },
          {
            dialect: 'mariadb',
            sql: 'insert into `books` (`author`, `title`) values (?, ?)',
            bindings: ['Kurt Vonnegut', 'Slaughterhouse Five']
          }
        ]
      }, done);
    });

    it('should generate an insert query when using an array of values', function(done) {
      Test({
        query: {
          insert: [
            {
              title: 'Slaughterhouse Five',
              author: 'Kurt Vonnegut'
            },
            {
              title: 'The Great Gatsby',
              author: 'F. Scott Fitzgerald'
            }
          ],
          into: 'books'
        },
        outcomes: [
          {
            dialect: 'postgresql',
            sql: 'insert into "books" ("author", "title") values ($1, $2), ($3, $4)',
            bindings: ['Kurt Vonnegut', 'Slaughterhouse Five', 'F. Scott Fitzgerald', 'The Great Gatsby']
          },
          {
            dialect: 'mysql',
            sql: 'insert into `books` (`author`, `title`) values (?, ?), (?, ?)',
            bindings: ['Kurt Vonnegut', 'Slaughterhouse Five', 'F. Scott Fitzgerald', 'The Great Gatsby']
          },
          {
            dialect: 'sqlite3',
            sql: 'insert into "books" ("author", "title") select ? as "author", ? as "title" union all select ? as "author", ? as "title"',
            bindings: ['Kurt Vonnegut', 'Slaughterhouse Five', 'F. Scott Fitzgerald', 'The Great Gatsby']
          },
          {
            dialect: 'oracle',
            sql: 'begin execute immediate \'insert into "books" ("author", "title") values (:1, :2)\' using :1, :2; execute immediate \'insert into "books" ("author", "title") values (:1, :2)\' using :3, :4;end;',
            bindings: ['Kurt Vonnegut', 'Slaughterhouse Five', 'F. Scott Fitzgerald', 'The Great Gatsby']
          },
          {
            dialect: 'mariadb',
            sql: 'insert into `books` (`author`, `title`) values (?, ?), (?, ?)',
            bindings: ['Kurt Vonnegut', 'Slaughterhouse Five', 'F. Scott Fitzgerald', 'The Great Gatsby']
          }
        ]
      }, done);
    });
  });
});
