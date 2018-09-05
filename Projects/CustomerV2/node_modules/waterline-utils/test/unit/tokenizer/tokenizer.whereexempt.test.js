var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('WHERE statements', function() {
    it('should generate a valid token array when exempt identifiers are used as keys', function() {
      var result = Tokenizer({
        select: ['from', 'count', 'insert'],
        from: 'user',
        where: {
          and: [{
            from: 'catland'
          }, {
            insert: false
          }, {
            count: {
              '>': 4
            }
          }]
        }
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: 'from' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: 'count' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: 'insert' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'user' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'AND' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'from' },
        { type: 'VALUE', value: 'catland' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'GROUP', value: 1 },
        { type: 'KEY', value: 'insert' },
        { type: 'VALUE', value: false },
        { type: 'ENDGROUP', value: 1 },
        { type: 'GROUP', value: 2 },
        { type: 'KEY', value: 'count' },
        { type: 'OPERATOR', value: '>' },
        { type: 'VALUE', value: 4 },
        { type: 'ENDOPERATOR', value: '>' },
        { type: 'ENDGROUP', value: 2 },
        { type: 'ENDCONDITION', value: 'AND' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' }
      ]);
    });
  });
});
