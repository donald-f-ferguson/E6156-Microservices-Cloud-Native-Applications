var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('Aggregations', function() {
    it('should generate a valid token array when SUM is used', function() {
      var result = Tokenizer({
        sum: 'active',
        from: 'users'
      });

      assert.deepEqual(result,  [
        { type: 'IDENTIFIER', value: 'SUM' },
        { type: 'VALUE', value: 'active' },
        { type: 'ENDIDENTIFIER', value: 'SUM' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' }
      ]);
    });

    it('should generate a valid token array when AVG is used', function() {
      var result = Tokenizer({
        avg: 'active',
        from: 'users'
      });

      assert.deepEqual(result,  [
        { type: 'IDENTIFIER', value: 'AVG' },
        { type: 'VALUE', value: 'active' },
        { type: 'ENDIDENTIFIER', value: 'AVG' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' }
      ]);
    });
  });
});
