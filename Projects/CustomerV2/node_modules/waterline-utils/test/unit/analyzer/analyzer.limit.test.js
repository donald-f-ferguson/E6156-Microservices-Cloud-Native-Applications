var Analyzer = require('../../../index').query.analyzer;
var tokenize = require('../../support/tokenize');
var assert = require('assert');

describe('Analyzer ::', function() {
  describe('LIMIT statements', function() {
    it('should generate a valid group when LIMIT is used', function() {
      var tokens = tokenize({
        select: ['*'],
        from: 'users',
        limit: 10
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result,  [
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: '*' }
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ],
        [
          { type: 'IDENTIFIER', value: 'LIMIT' },
          { type: 'VALUE', value: 10 }
        ]
      ]);
    });
  });
});
