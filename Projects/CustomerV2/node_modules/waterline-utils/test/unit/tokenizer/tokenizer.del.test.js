var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('DELETE statements', function() {
    it('should generate a valid token array for an DELETE is used', function() {
      var result = Tokenizer({
        del: true,
        from: 'accounts',
        where: {
          and: [
            {
              activated: false
            }
          ]
        }
      });

      assert.deepEqual(result, [
        { type: 'IDENTIFIER', value: 'DELETE' },
        { type: 'ENDIDENTIFIER', value: 'DELETE' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'accounts' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'AND' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'activated' },
        { type: 'VALUE', value: false },
        { type: 'ENDGROUP', value: 0 },
        { type: 'ENDCONDITION', value: 'AND' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' }
      ]);
    });
  });
});
