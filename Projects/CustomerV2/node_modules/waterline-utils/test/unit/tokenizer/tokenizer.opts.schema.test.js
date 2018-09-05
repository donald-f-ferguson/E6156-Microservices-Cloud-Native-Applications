var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('OPTS', function() {
    it('should generate a valid token array when a SCHEMA is used', function() {
      var result = Tokenizer({
        select: ['*'],
        from: 'books',
        opts: {
          schema: 'foo'
        }
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: '*' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'books' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'SCHEMA' },
        { type: 'VALUE', value: 'foo' },
        { type: 'ENDIDENTIFIER', value: 'SCHEMA' }
      ]);
    });
  });
});
