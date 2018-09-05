var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('UPDATE statements', function() {
    it('should generate a valid token array for an UPDATE is used', function() {
      var result = Tokenizer({
        update: {
          status: 'archived'
        },
        where: {
          and: [
            {
              publishedDate: {
                '>': 2000
              }
            }
          ]
        },
        using: 'books'
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'UPDATE' },
        { type: 'KEY', value: 'status' },
        { type: 'VALUE', value: 'archived' },
        { type: 'ENDIDENTIFIER', value: 'UPDATE' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'AND' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'publishedDate' },
        { type: 'OPERATOR', value: '>' },
        { type: 'VALUE', value: 2000 },
        { type: 'ENDOPERATOR', value: '>' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'ENDCONDITION', value: 'AND' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' },
        { type: 'IDENTIFIER', value: 'USING' },
        { type: 'VALUE', value: 'books' },
        { type: 'ENDIDENTIFIER', value: 'USING' }
      ]);
    });
  });
});
