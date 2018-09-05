var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('DISTINCT statements', function() {
    it('should generate a valid token array when DISTINCT is used', function() {
      var result = Tokenizer({
        select: {
          distinct: ['firstName', 'lastName']
        },
        from: 'customers'
      });

      assert.deepEqual(result,  [
        { type: 'IDENTIFIER', value: 'DISTINCT' },
        { type: 'VALUE', value: ['firstName', 'lastName'] },
        { type: 'ENDIDENTIFIER', value: 'DISTINCT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'customers' },
        { type: 'ENDIDENTIFIER', value: 'FROM' }
      ]);
    });
  });
});
