var Analyzer = require('../../../index').query.analyzer;
var tokenize = require('../../support/tokenize');
var assert = require('assert');

describe('Analyzer ::', function() {
  describe('DISTINCT statements', function() {
    it('should generate a valid group when when DISTINCT is used', function() {
      var tokens = tokenize({
        select: {
          distinct: ['firstName', 'lastName']
        },
        from: 'customers'
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result,  [
        [
          { type: 'IDENTIFIER', value: 'DISTINCT' },
          { type: 'VALUE', value: ['firstName', 'lastName'] }
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'customers' }
        ]
      ]);
    });
  });
});
