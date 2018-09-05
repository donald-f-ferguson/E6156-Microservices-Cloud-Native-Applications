var Analyzer = require('../../../index').query.analyzer;
var tokenize = require('../../support/tokenize');
var assert = require('assert');

describe('Analyzer ::', function() {
  describe('RETURNING statements', function() {
    it('should generate a valid group for RETURNING statements', function() {
      var tokens = tokenize({
        insert: {
          title: 'Slaughterhouse Five'
        },
        into: 'books',
        returning: 'author'
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result, [
        [
          { type: 'IDENTIFIER', value: 'INSERT' },
          { type: 'KEY', value: 'title' },
          { type: 'VALUE', value: 'Slaughterhouse Five' }
        ],
        [
          { type: 'IDENTIFIER', value: 'INTO' },
          { type: 'VALUE', value: 'books' }
        ],
        [
          { type: 'IDENTIFIER', value: 'RETURNING' },
          { type: 'VALUE', value: 'author' }
        ]
      ]);
    });

    it('should generate a valid group for RETURNING statements when arrays are used', function() {
      var tokens = tokenize({
        insert: {
          title: 'Slaughterhouse Five'
        },
        into: 'books',
        returning: ['author', 'title']
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result, [
        [
          { type: 'IDENTIFIER', value: 'INSERT' },
          { type: 'KEY', value: 'title' },
          { type: 'VALUE', value: 'Slaughterhouse Five' }
        ],
        [
          { type: 'IDENTIFIER', value: 'INTO' },
          { type: 'VALUE', value: 'books' }
        ],
        [
          { type: 'IDENTIFIER', value: 'RETURNING' },
          { type: 'VALUE', value: ['author', 'title'] }
        ]
      ]);
    });
  });
});
