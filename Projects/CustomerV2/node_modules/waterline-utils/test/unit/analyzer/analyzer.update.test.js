var Analyzer = require('../../../index').query.analyzer;
var tokenize = require('../../support/tokenize');
var assert = require('assert');

describe('Analyzer ::', function() {
  describe('UPDATE statements', function() {
    it('should generate a valid group for UPDATE statements', function() {
      var tokens = tokenize({
        update: {
          status: 'archived'
        },
        where: {
          and: [
            {
              publishedDate: {
                '>': 2000
              }
            }
          ]
        },
        using: 'books'
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result, [
        [
          { type: 'IDENTIFIER', value: 'UPDATE' },
          { type: 'KEY', value: 'status' },
          { type: 'VALUE', value: 'archived' }
        ],
        [
          { type: 'IDENTIFIER', value: 'WHERE' },
          { type: 'CONDITION', value: 'AND' },
          [
            { type: 'KEY', value: 'publishedDate' },
            { type: 'OPERATOR', value: '>' },
            { type: 'VALUE', value: 2000 }
          ]
        ],
        [
          { type: 'IDENTIFIER', value: 'USING' },
          { type: 'VALUE', value: 'books' }
        ]
      ]);
    });
  });
});
