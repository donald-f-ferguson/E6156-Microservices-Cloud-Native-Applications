var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('ORDER BY statements', function() {
    it('should generate a valid token array when ORDER BY is used', function() {
      var result = Tokenizer({
        select: ['*'],
        from: 'users',
        orderBy: [
          {
            name: 'desc'
          }
        ]
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: '*' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'ORDERBY' },
        { type: 'KEY', value: 'name' },
        { type: 'VALUE', value: 'desc' },
        { type: 'ENDIDENTIFIER', value: 'ORDERBY' }
      ]);
    });
  });
});
