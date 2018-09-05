var Analyzer = require('../../../index').query.analyzer;
var tokenize = require('../../support/tokenize');
var assert = require('assert');

describe('Analyzer ::', function() {
  describe('OPTS', function() {
    it('should generate a valid group when a SCHEMA is used', function() {
      var tokens = tokenize({
        select: ['title', 'author', 'year'],
        from: 'books',
        opts: {
          schema: 'foo'
        }
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result,  [
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'title' }
        ],
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'author' }
        ],
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'year' }
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'books' }
        ],
        [
          { type: 'IDENTIFIER', value: 'SCHEMA' },
          { type: 'VALUE', value: 'foo' }
        ]
      ]);
    });
  });
});
