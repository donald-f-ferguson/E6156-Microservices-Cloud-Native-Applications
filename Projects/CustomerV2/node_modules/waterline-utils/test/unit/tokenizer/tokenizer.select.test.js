var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('SELECT statements', function() {
    it('should generate a valid token array when "*" is used', function() {
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

    it('should generate a valid token array when defined columns are used', function() {
      var result = Tokenizer({
        select: ['title', 'author', 'year'],
        from: 'books'
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: 'title' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: 'author' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: 'year' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'books' },
        { type: 'ENDIDENTIFIER', value: 'FROM' }
      ]);
    });
  });
});
