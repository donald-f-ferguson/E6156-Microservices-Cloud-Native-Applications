var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('Various Operators', function() {
    it('should generate a valid token array when LIKE is used', function() {
      var result = Tokenizer({
        select: ['*'],
        from: 'users',
        where: {
          or: [
            {
              name: {
                like: '%Test%'
              }
            },
            {
              id: {
                nin: [1, 2, 3]
              }
            }
          ]
        }
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: '*' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'OR' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'name' },
        { type: 'OPERATOR', value: 'like' },
        { type: 'VALUE', value: '%Test%' },
        { type: 'ENDOPERATOR', value: 'like' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'GROUP', value: 1 },
        { type: 'KEY', value: 'id' },
        { type: 'CONDITION', value: 'NOTIN' },
        { type: 'VALUE', value: [1, 2, 3] },
        { type: 'ENDCONDITION', value: 'NOTIN' },
        { type: 'ENDGROUP', value: 1 },
        { type: 'ENDCONDITION', value: 'OR' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' }
      ]);
    });

    it('should generate a valid token array when != is used', function() {
      var result = Tokenizer({
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
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: 'id' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'AND' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'firstName' },
        { type: 'OPERATOR', value: '!=' },
        { type: 'VALUE', value: 'Test' },
        { type: 'ENDOPERATOR', value: '!=' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'GROUP', value: 1 },
        { type: 'KEY', value: 'lastName' },
        { type: 'OPERATOR', value: '!=' },
        { type: 'VALUE', value: 'User' },
        { type: 'ENDOPERATOR', value: '!=' },
        { type: 'ENDGROUP', value: 1 },
        { type: 'ENDCONDITION', value: 'AND' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' }
      ]);
    });

    it('should generate a valid token array when nested != statements are used', function() {
      var result = Tokenizer({
        select: ['*'],
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
                    '>': 10
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
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: '*' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'OR' },
        { type: 'GROUP', value: 0 },
        { type: 'CONDITION', value: 'OR' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'id' },
        { type: 'OPERATOR', value: '!=' },
        { type: 'VALUE', value: 1 },
        { type: 'ENDOPERATOR', value: '!=' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'GROUP', value: 1 },
        { type: 'KEY', value: 'id' },
        { type: 'OPERATOR', value: '>' },
        { type: 'VALUE', value: 10 },
        { type: 'ENDOPERATOR', value: '>' },
        { type: 'ENDGROUP', value: 1 },
        { type: 'ENDCONDITION', value: 'OR' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'GROUP', value: 1 },
        { type: 'KEY', value: 'name' },
        { type: 'OPERATOR', value: '!=' },
        { type: 'VALUE', value: 'Tester' },
        { type: 'ENDOPERATOR', value: '!=' },
        { type: 'ENDGROUP', value: 1 },
        { type: 'ENDCONDITION', value: 'OR' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' }
      ]);
    });

    it('should generate a valid token array when multiple operators are used', function() {
      var result = Tokenizer({
        select: ['*'],
        from: 'users',
        where: {
          or: [
            {
              name: 'John'
            },
            {
              votes: {
                '>': 100
              },
              title: {
                '!=': 'Admin'
              }
            }
          ]
        }
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: '*' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'OR' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'name' },
        { type: 'VALUE', value: 'John' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'GROUP', value: 1 },
        { type: 'KEY', value: 'votes' },
        { type: 'OPERATOR', value: '>' },
        { type: 'VALUE', value: 100 },
        { type: 'ENDOPERATOR', value: '>' },
        { type: 'KEY', value: 'title' },
        { type: 'OPERATOR', value: '!=' },
        { type: 'VALUE', value: 'Admin' },
        { type: 'ENDOPERATOR', value: '!=' },
        { type: 'ENDGROUP', value: 1 },
        { type: 'ENDCONDITION', value: 'OR' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' }
      ]);
    });
  });
});
