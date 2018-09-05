var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('RETURNING statements', function() {
    it('should generate a valid token array when RETURNING is used', function() {
      var result = Tokenizer({
        insert: {
          title: 'Slaughterhouse Five'
        },
        into: 'books',
        returning: 'author'
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'INSERT' },
        { type: 'KEY', value: 'title' },
        { type: 'VALUE', value: 'Slaughterhouse Five' },
        { type: 'ENDIDENTIFIER', value: 'INSERT' },
        { type: 'IDENTIFIER', value: 'INTO' },
        { type: 'VALUE', value: 'books' },
        { type: 'ENDIDENTIFIER', value: 'INTO' },
        { type: 'IDENTIFIER', value: 'RETURNING' },
        { type: 'VALUE', value: 'author' },
        { type: 'ENDIDENTIFIER', value: 'RETURNING' }
      ]);
    });

    it('should generate a valid token array when RETURNING is used as an array', function() {
      var result = Tokenizer({
        insert: {
          title: 'Slaughterhouse Five'
        },
        into: 'books',
        returning: ['author', 'title']
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'INSERT' },
        { type: 'KEY', value: 'title' },
        { type: 'VALUE', value: 'Slaughterhouse Five' },
        { type: 'ENDIDENTIFIER', value: 'INSERT' },
        { type: 'IDENTIFIER', value: 'INTO' },
        { type: 'VALUE', value: 'books' },
        { type: 'ENDIDENTIFIER', value: 'INTO' },
        { type: 'IDENTIFIER', value: 'RETURNING' },
        { type: 'VALUE', value: ['author', 'title'] },
        { type: 'ENDIDENTIFIER', value: 'RETURNING' }
      ]);
    });
  });
});
