var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('Grouping statements with AND', function() {
    it('should generate a valid token array when AND is used as an array', function() {
      var result = Tokenizer({
        select: ['*'],
        from: 'users',
        where: {
          and: [
            {
              firstName: 'foo'
            },
            {
              lastName: 'bar'
            }
          ]
        }
      });

      assert.deepEqual(result,  [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: '*' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'AND' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'firstName' },
        { type: 'VALUE', value: 'foo' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'GROUP', value: 1 },
        { type: 'KEY', value: 'lastName' },
        { type: 'VALUE', value: 'bar' },
        { type: 'ENDGROUP', value: 1 },
        { type: 'ENDCONDITION', value: 'AND' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' }
      ]);
    });

    it('should generate a valid token array when using OR conditions with AND', function() {
      var result = Tokenizer({
        select: ['*'],
        from: 'users',
        where: {
          and: [
            {
              or: [
                {
                  firstName: 'John'
                },
                {
                  lastName: 'Smith'
                }
              ]
            },
            {
              or: [
                {
                  qty: {
                    '>': 100
                  }
                },
                {
                  price: {
                    '<': 10.00
                  }
                }
              ]
            }
          ]
        }
      });

      assert.deepEqual(result,  [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: '*' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'AND' },
        { type: 'GROUP', value: 0 },
        { type: 'CONDITION', value: 'OR' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'firstName' },
        { type: 'VALUE', value: 'John' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'GROUP', value: 1 },
        { type: 'KEY', value: 'lastName' },
        { type: 'VALUE', value: 'Smith' },
        { type: 'ENDGROUP', value: 1 },
        { type: 'ENDCONDITION', value: 'OR' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'GROUP', value: 1 },
        { type: 'CONDITION', value: 'OR' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'qty' },
        { type: 'OPERATOR', value: '>' },
        { type: 'VALUE', value: 100 },
        { type: 'ENDOPERATOR', value: '>' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'GROUP', value: 1 },
        { type: 'KEY', value: 'price' },
        { type: 'OPERATOR', value: '<' },
        { type: 'VALUE', value: 10.00 },
        { type: 'ENDOPERATOR', value: '<' },
        { type: 'ENDGROUP', value: 1 },
        { type: 'ENDCONDITION', value: 'OR' },
        { type: 'ENDGROUP', value: 1 },
        { type: 'ENDCONDITION', value: 'AND' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' }
      ]);
    });
  });
});
