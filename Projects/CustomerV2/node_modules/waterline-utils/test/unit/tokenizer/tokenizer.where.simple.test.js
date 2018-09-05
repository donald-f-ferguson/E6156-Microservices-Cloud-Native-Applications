var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('Simple WHERE statements', function() {
    it('should generate a valid token array', function() {
      var result = Tokenizer({
        select: ['id'],
        where: {
          and: [
            {
              firstName: 'Test'
            },
            {
              lastName: 'User'
            }
          ]
        },
        from: 'users'
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: 'id' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'AND' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'firstName' },
        { type: 'VALUE', value: 'Test' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'GROUP', value: 1 },
        { type: 'KEY', value: 'lastName' },
        { type: 'VALUE', value: 'User' },
        { type: 'ENDGROUP', value: 1 },
        { type: 'ENDCONDITION', value: 'AND' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' }
      ]);
    });

    it('should generate a valid token array when used with operators', function() {
      var result = Tokenizer({
        select: ['*'],
        where: {
          and: [
            {
              votes: {
                '>': 100
              }
            }
          ]
        },
        from: 'users'
      });

      assert.deepEqual(result,  [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: '*' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'AND' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'votes' },
        { type: 'OPERATOR', value: '>' },
        { type: 'VALUE', value: 100 },
        { type: 'ENDOPERATOR', value: '>' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'ENDCONDITION', value: 'AND' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' }
      ]);
    });

    it('should generate a valid token array when used with multiple operators', function() {
      var result = Tokenizer({
        select: ['*'],
        where: {
          and: [
            {
              votes: {
                '>': 100
              }
            },
            {
              votes: {
                '<': 200
              }
            }
          ]
        },
        from: 'users'
      });

      assert.deepEqual(result,  [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: '*' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'AND' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'votes' },
        { type: 'OPERATOR', value: '>' },
        { type: 'VALUE', value: 100 },
        { type: 'ENDOPERATOR', value: '>' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'GROUP', value: 1 },
        { type: 'KEY', value: 'votes' },
        { type: 'OPERATOR', value: '<' },
        { type: 'VALUE', value: 200 },
        { type: 'ENDOPERATOR', value: '<' },
        { type: 'ENDGROUP', value: 1 },
        { type: 'ENDCONDITION', value: 'AND' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' }
      ]);
    });

    it('should generate a valid token array when used with multiple columns and operators', function() {
      var result = Tokenizer({
        select: ['*'],
        where: {
          and: [
            {
              votes: {
                '>': 100
              }
            },
            {
              age: {
                '<': 50
              }
            }
          ]
        },
        from: 'users'
      });

      assert.deepEqual(result,  [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: '*' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'AND' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'votes' },
        { type: 'OPERATOR', value: '>' },
        { type: 'VALUE', value: 100 },
        { type: 'ENDOPERATOR', value: '>' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'GROUP', value: 1 },
        { type: 'KEY', value: 'age' },
        { type: 'OPERATOR', value: '<' },
        { type: 'VALUE', value: 50 },
        { type: 'ENDOPERATOR', value: '<' },
        { type: 'ENDGROUP', value: 1 },
        { type: 'ENDCONDITION', value: 'AND' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' }
      ]);
    });
  });
});
