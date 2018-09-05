var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('COUNT statements', function() {
    it('should generate a valid token array when COUNT is used', function() {
      var result = Tokenizer({
        count: true,
        from: 'users'
      });

      assert.deepEqual(result,  [
        { type: 'IDENTIFIER', value: 'COUNT' },
        { type: 'VALUE', value: true },
        { type: 'ENDIDENTIFIER', value: 'COUNT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' }
      ]);
    });
  });
});
