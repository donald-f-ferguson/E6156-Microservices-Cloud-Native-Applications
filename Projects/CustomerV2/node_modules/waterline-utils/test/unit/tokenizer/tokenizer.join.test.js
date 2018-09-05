var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('JOINS ::', function() {
    it('should generate a valid token array when a JOIN operation is used', function() {
      var result = Tokenizer({
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

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: 'users.id' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: 'contacts.phone' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'JOIN' },
        { type: 'KEY', value: 'TABLE' },
        { type: 'VALUE', value: 'contacts' },
        { type: 'KEY', value: 'TABLE_KEY' },
        { type: 'VALUE', value: 'users' },
        { type: 'KEY', value: 'COLUMN_KEY' },
        { type: 'VALUE', value: 'id' },
        { type: 'KEY', value: 'TABLE_KEY' },
        { type: 'VALUE', value: 'contacts' },
        { type: 'KEY', value: 'COLUMN_KEY' },
        { type: 'VALUE', value: 'user_id' },
        { type: 'ENDIDENTIFIER', value: 'JOIN' }
      ]);
    });

    it('should generate a valid token array when multiple JOIN operations is used', function() {
      var result = Tokenizer({
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

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: 'users.id' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: 'contacts.phone' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'JOIN' },
        { type: 'KEY', value: 'TABLE' },
        { type: 'VALUE', value: 'contacts' },
        { type: 'KEY', value: 'TABLE_KEY' },
        { type: 'VALUE', value: 'users' },
        { type: 'KEY', value: 'COLUMN_KEY' },
        { type: 'VALUE', value: 'id' },
        { type: 'KEY', value: 'TABLE_KEY' },
        { type: 'VALUE', value: 'contacts' },
        { type: 'KEY', value: 'COLUMN_KEY' },
        { type: 'VALUE', value: 'user_id' },
        { type: 'ENDIDENTIFIER', value: 'JOIN' },
        { type: 'IDENTIFIER', value: 'JOIN' },
        { type: 'KEY', value: 'TABLE' },
        { type: 'VALUE', value: 'carriers' },
        { type: 'KEY', value: 'TABLE_KEY' },
        { type: 'VALUE', value: 'users' },
        { type: 'KEY', value: 'COLUMN_KEY' },
        { type: 'VALUE', value: 'id' },
        { type: 'KEY', value: 'TABLE_KEY' },
        { type: 'VALUE', value: 'carriers' },
        { type: 'KEY', value: 'COLUMN_KEY' },
        { type: 'VALUE', value: 'user_id' },
        { type: 'ENDIDENTIFIER', value: 'JOIN' }
      ]);
    });

    it('should generate a valid token array when an INNERJOIN operation is used', function() {
      var result = Tokenizer({
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

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: 'users.id' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: 'contacts.phone' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'INNERJOIN' },
        { type: 'KEY', value: 'TABLE' },
        { type: 'VALUE', value: 'contacts' },
        { type: 'KEY', value: 'TABLE_KEY' },
        { type: 'VALUE', value: 'users' },
        { type: 'KEY', value: 'COLUMN_KEY' },
        { type: 'VALUE', value: 'id' },
        { type: 'KEY', value: 'TABLE_KEY' },
        { type: 'VALUE', value: 'contacts' },
        { type: 'KEY', value: 'COLUMN_KEY' },
        { type: 'VALUE', value: 'user_id' },
        { type: 'ENDIDENTIFIER', value: 'INNERJOIN' }
      ]);
    });

    it('should generate a valid token array when a grouped OR JOIN operation is used', function() {
      var result = Tokenizer({
        select: ['*'],
        from: 'users',
        join: [
          {
            from: 'accounts',
            on: {
              or: [
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
          }
        ]
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: '*' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'JOIN' },
        { type: 'KEY', value: 'TABLE' },
        { type: 'VALUE', value: 'accounts' },
        { type: 'COMBINATOR', value: 'OR' },
        { type: 'KEY', value: 'TABLE_KEY' },
        { type: 'VALUE', value: 'accounts' },
        { type: 'KEY', value: 'COLUMN_KEY' },
        { type: 'VALUE', value: 'id' },
        { type: 'KEY', value: 'TABLE_KEY' },
        { type: 'VALUE', value: 'users' },
        { type: 'KEY', value: 'COLUMN_KEY' },
        { type: 'VALUE', value: 'account_id' },
        { type: 'COMBINATOR', value: 'OR' },
        { type: 'KEY', value: 'TABLE_KEY' },
        { type: 'VALUE', value: 'accounts' },
        { type: 'KEY', value: 'COLUMN_KEY' },
        { type: 'VALUE', value: 'owner_id' },
        { type: 'KEY', value: 'TABLE_KEY' },
        { type: 'VALUE', value: 'users' },
        { type: 'KEY', value: 'COLUMN_KEY' },
        { type: 'VALUE', value: 'id' },
        { type: 'ENDIDENTIFIER', value: 'JOIN' }
      ]);
    });

    it('should generate a valid token array when a grouped AND JOIN operation is used', function() {
      var result = Tokenizer({
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

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: '*' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'JOIN' },
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
        { type: 'VALUE', value: 'id' },
        { type: 'ENDIDENTIFIER', value: 'JOIN' }
      ]);
    });
  });
});
