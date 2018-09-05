var Analyzer = require('../../../index').query.analyzer;
var tokenize = require('../../support/tokenize');
var assert = require('assert');

describe('Analyzer ::', function() {
  describe('JOINS', function() {
    it('should generate a valid group when JOIN is used', function() {
      var tokens = tokenize({
        select: ['users.id', 'contacts.phone'],
        from: 'users',
        join: [
          {
            from: 'contacts',
            on: {
              users: 'id',
              contacts: 'user_id'
            }
          }
        ]
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result, [
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'users.id' }
        ],
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'contacts.phone' }
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ],
        [
          { type: 'IDENTIFIER', value: 'JOIN' },
          [
            { type: 'KEY', value: 'TABLE' },
            { type: 'VALUE', value: 'contacts' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'users' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'id' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'contacts' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'user_id' }
          ]
        ]
      ]);
    });

    it('should generate a valid group when multiple JOINs are used', function() {
      var tokens = tokenize({
        select: ['users.id', 'contacts.phone'],
        from: 'users',
        join: [
          {
            from: 'contacts',
            on: {
              users: 'id',
              contacts: 'user_id'
            }
          },
          {
            from: 'carriers',
            on: {
              users: 'id',
              carriers: 'user_id'
            }
          }
        ]
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result, [
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'users.id' }
        ],
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'contacts.phone' }
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ],
        [
          { type: 'IDENTIFIER', value: 'JOIN' },
          [
            { type: 'KEY', value: 'TABLE' },
            { type: 'VALUE', value: 'contacts' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'users' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'id' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'contacts' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'user_id' }
          ]
        ],
        [
          { type: 'IDENTIFIER', value: 'JOIN' },
          [
            { type: 'KEY', value: 'TABLE' },
            { type: 'VALUE', value: 'carriers' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'users' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'id' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'carriers' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'user_id' }
          ]
        ]
      ]);
    });

    it('should generate a valid group when INNERJOIN', function() {
      var tokens = tokenize({
        select: ['users.id', 'contacts.phone'],
        from: 'users',
        innerJoin: [
          {
            from: 'contacts',
            on: {
              users: 'id',
              contacts: 'user_id'
            }
          }
        ]
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result, [
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'users.id' }
        ],
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'contacts.phone' }
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ],
        [
          { type: 'IDENTIFIER', value: 'INNERJOIN' },
          [
            { type: 'KEY', value: 'TABLE' },
            { type: 'VALUE', value: 'contacts' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'users' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'id' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'contacts' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'user_id' }
          ]
        ]
      ]);
    });

    it('should generate a valid group when grouped JOINs are used', function() {
      var tokens = tokenize({
        select: ['*'],
        from: 'users',
        join: [
          {
            from: 'accounts',
            on: [
              {
                accounts: 'id',
                users: 'account_id'
              },
              {
                accounts: 'owner_id',
                users: 'id'
              }
            ]
          }
        ]
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result, [
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: '*' }
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ],
        [
          { type: 'IDENTIFIER', value: 'JOIN' },
          [
            { type: 'KEY', value: 'TABLE' },
            { type: 'VALUE', value: 'accounts' },
            { type: 'COMBINATOR', value: 'AND' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'accounts' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'id' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'users' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'account_id' },
            { type: 'COMBINATOR', value: 'AND' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'accounts' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'owner_id' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'users' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'id' }
          ]
        ]
      ]);
    });

    it('should generate a valid group when multiple grouped JOINs are used', function() {
      var tokens = tokenize({
        select: ['*'],
        from: 'users',
        join: [
          {
            from: 'accounts',
            on: [
              {
                accounts: 'id',
                users: 'account_id'
              },
              {
                accounts: 'owner_id',
                users: 'id'
              }
            ]
          },
          {
            from: 'contacts',
            on: [
              {
                accounts: 'id',
                contacts: 'account_id'
              },
              {
                accounts: 'owner_id',
                contacts: 'id'
              }
            ]
          }
        ]
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result, [
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: '*' }
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ],
        [
          { type: 'IDENTIFIER', value: 'JOIN' },
          [
            { type: 'KEY', value: 'TABLE' },
            { type: 'VALUE', value: 'accounts' },
            { type: 'COMBINATOR', value: 'AND' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'accounts' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'id' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'users' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'account_id' },
            { type: 'COMBINATOR', value: 'AND' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'accounts' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'owner_id' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'users' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'id' }
          ]
        ],
        [
          { type: 'IDENTIFIER', value: 'JOIN' },
          [
            { type: 'KEY', value: 'TABLE' },
            { type: 'VALUE', value: 'contacts' },
            { type: 'COMBINATOR', value: 'AND' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'accounts' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'id' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'contacts' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'account_id' },
            { type: 'COMBINATOR', value: 'AND' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'accounts' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'owner_id' },
            { type: 'KEY', value: 'TABLE_KEY' },
            { type: 'VALUE', value: 'contacts' },
            { type: 'KEY', value: 'COLUMN_KEY' },
            { type: 'VALUE', value: 'id' }
          ]
        ]
      ]);
    });
  });
});
