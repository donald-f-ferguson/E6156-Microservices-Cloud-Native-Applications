var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('INSERT statements', function() {
    it('should generate a valid token array for an INSERT is used', function() {
      var result = Tokenizer({
        insert: {
          title: 'Slaughterhouse Five'
        },
        into: 'books'
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'INSERT' },
        { type: 'KEY', value: 'title' },
        { type: 'VALUE', value: 'Slaughterhouse Five' },
        { type: 'ENDIDENTIFIER', value: 'INSERT' },
        { type: 'IDENTIFIER', value: 'INTO' },
        { type: 'VALUE', value: 'books' },
        { type: 'ENDIDENTIFIER', value: 'INTO' }
      ]);
    });

    it('should generate a valid token array for an INSERT is used as an array', function() {
      var result = Tokenizer({
        insert: [
          {
            title: 'Slaughterhouse Five'
          },
          {
            title: 'The Great Gatsby'
          }
        ],
        into: 'books'
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'INSERT' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'title' },
        { type: 'VALUE', value: 'Slaughterhouse Five' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'GROUP', value: 1 },
        { type: 'KEY', value: 'title' },
        { type: 'VALUE', value: 'The Great Gatsby' },
        { type: 'ENDGROUP', value: 1 },
        { type: 'ENDIDENTIFIER', value: 'INSERT' },
        { type: 'IDENTIFIER', value: 'INTO' },
        { type: 'VALUE', value: 'books' },
        { type: 'ENDIDENTIFIER', value: 'INTO' }
      ]);
    });
  });
});
