var Analyzer = require('../../../index').query.analyzer;
var tokenize = require('../../support/tokenize');
var assert = require('assert');

describe('Analyzer ::', function() {
  describe('INSERT statements', function() {
    it('should generate a valid group for INSERT statements', function() {
      var tokens = tokenize({
        insert: {
          title: 'Slaughterhouse Five'
        },
        into: 'books'
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
        ]
      ]);
    });

    it('should generate a valid group for INSERT statements when an array is used', function() {
      var tokens = tokenize({
        insert: [
          {
            title: 'Slaughterhouse Five',
            author: 'Kurt Vonnegut'
          },
          {
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald'
          }
        ],
        into: 'books'
      });

      var result = Analyzer(tokens);
      assert.deepEqual(result, [
        [
          { type: 'IDENTIFIER', value: 'INSERT' },
          [
            { type: 'KEY', value: 'title' },
            { type: 'VALUE', value: 'Slaughterhouse Five' },
            { type: 'KEY', value: 'author' },
            { type: 'VALUE', value: 'Kurt Vonnegut' }
          ],
          [
            { type: 'KEY', value: 'title' },
            { type: 'VALUE', value: 'The Great Gatsby' },
            { type: 'KEY', value: 'author' },
            { type: 'VALUE', value: 'F. Scott Fitzgerald' }
          ]
        ],
        [
          { type: 'IDENTIFIER', value: 'INTO' },
          { type: 'VALUE', value: 'books' }
        ]
      ]);
    });
  });
});
