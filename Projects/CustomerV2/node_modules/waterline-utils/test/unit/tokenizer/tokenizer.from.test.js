var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('FROM statements', function() {
    it('should generate a valid token array when FROM is used', function() {
      var result = Tokenizer({
        select: ['*'],
        from: 'books'
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: '*' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'books' },
        { type: 'ENDIDENTIFIER', value: 'FROM' }
      ]);
    });
  });
});
