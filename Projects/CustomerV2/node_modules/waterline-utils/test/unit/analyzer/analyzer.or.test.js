var Analyzer = require('../../../index').query.analyzer;
var tokenize = require('../../support/tokenize');
var assert = require('assert');

describe('Analyzer ::', function() {
  describe('Grouping statements with OR', function() {
    it('should generate a valid group', function() {
      var tokens = tokenize({
        select: ['*'],
        where: {
          or: [
            {
              id: { '>': 10 }
            },
            {
              name: 'Tester'
            }
          ]
        },
        from: 'users'
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result,  [
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: '*' }
        ],
        [
          { type: 'IDENTIFIER', value: 'WHERE' },
          [
            { type: 'KEY', value: 'id' },
            { type: 'OPERATOR', value: '>' },
            { type: 'VALUE', value: 10 }
          ],
          [
            { type: 'KEY', value: 'name' },
            { type: 'VALUE', value: 'Tester' }
          ]
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ]
      ]);
    });

    it('should generate a valid group when using nested OR conditions', function() {
      var tokens = tokenize({
        select: ['*'],
        where: {
          or: [
            {
              or: [
                { id: 1 },
                { id: { '>': 10 } }
              ]
            },
            {
              name: 'Tester'
            }
          ]
        },
        from: 'users'
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result, [
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: '*' }
        ],
        [
          { type: 'IDENTIFIER', value: 'WHERE' },
          [
            [
              { type: 'KEY', value: 'id' },
              { type: 'VALUE', value: 1 }
            ],
            [
              { type: 'KEY', value: 'id' },
              { type: 'OPERATOR', value: '>' },
              { type: 'VALUE', value: 10 }
            ]
          ],
          [
            { type: 'KEY', value: 'name' },
            { type: 'VALUE', value: 'Tester' }
          ]
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ]
      ]);
    });
  });
});
