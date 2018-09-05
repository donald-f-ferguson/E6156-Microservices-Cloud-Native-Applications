var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('LIMIT statements', function() {
    it('should generate a valid token array when LIMIT is used', function() {
      var result = Tokenizer({
        select: ['*'],
        from: 'users',
        limit: 10
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: '*' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'LIMIT' },
        { type: 'VALUE', value: 10 },
        { type: 'ENDIDENTIFIER', value: 'LIMIT' }
      ]);
    });
  });
});
