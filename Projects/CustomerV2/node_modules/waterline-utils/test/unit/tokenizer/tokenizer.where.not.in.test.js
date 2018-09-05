var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('WHERE NOT IN statements', function() {
    it('should generate a valid token array', function() {
      var result = Tokenizer({
        select: ['name'],
        from: 'users',
        where: {
          and: [
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
        { type: 'VALUE', value: 'name' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'AND' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'id' },
        { type: 'CONDITION', value: 'NOTIN' },
        { type: 'VALUE', value: [1, 2, 3] },
        { type: 'ENDCONDITION', value: 'NOTIN' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'ENDCONDITION', value: 'AND' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' }
      ]);
    });

    it('should generate a valid token array when in an OR statement', function() {
      var result = Tokenizer({
        select: ['name'],
        from: 'users',
        where: {
          or: [
            {
              id: {
                nin: [1, 2, 3]
              }
            },
            {
              id: {
                nin: [4, 5, 6]
              }
            }
          ]
        }
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: 'name' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'OR' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'id' },
        { type: 'CONDITION', value: 'NOTIN' },
        { type: 'VALUE', value: [1, 2, 3] },
        { type: 'ENDCONDITION', value: 'NOTIN' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'GROUP', value: 1 },
        { type: 'KEY', value: 'id' },
        { type: 'CONDITION', value: 'NOTIN' },
        { type: 'VALUE', value: [4, 5, 6] },
        { type: 'ENDCONDITION', value: 'NOTIN' },
        { type: 'ENDGROUP', value: 1 },
        { type: 'ENDCONDITION', value: 'OR' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' }
      ]);
    });
  });
});
