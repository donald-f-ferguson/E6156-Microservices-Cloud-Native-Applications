var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('Grouping statements with OR', function() {
    it('should generate a valid token array', function() {
      var result = Tokenizer({
        select: ['*'],
        where: {
          or: [
            {
              id: { '>': 10 }
            },
            {
              name: 'Tester'
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
        { type: 'CONDITION', value: 'OR' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'id' },
        { type: 'OPERATOR', value: '>' },
        { type: 'VALUE', value: 10 },
        { type: 'ENDOPERATOR', value: '>' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'GROUP', value: 1 },
        { type: 'KEY', value: 'name' },
        { type: 'VALUE', value: 'Tester' },
        { type: 'ENDGROUP', value: 1 },
        { type: 'ENDCONDITION', value: 'OR' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' }
      ]);
    });

    it('should generate a valid token array when using nested OR conditions', function() {
      var result = Tokenizer({
        select: ['*'],
        where: {
          or: [
            {
              or: [
                { id: 1 },
                { id: { '>': 10 } }
              ]
            },
            {
              name: 'Tester'
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
        { type: 'CONDITION', value: 'OR' },
        { type: 'GROUP', value: 0 },
        { type: 'CONDITION', value: 'OR' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'id' },
        { type: 'VALUE', value: 1 },
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
        { type: 'VALUE', value: 'Tester' },
        { type: 'ENDGROUP', value: 1 },
        { type: 'ENDCONDITION', value: 'OR' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' }
      ]);
    });
  });
});
