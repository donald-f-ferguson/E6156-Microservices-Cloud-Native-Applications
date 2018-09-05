var Analyzer = require('../../../index').query.analyzer;
var tokenize = require('../../support/tokenize');
var assert = require('assert');

describe('Analyzer ::', function() {
  describe('Simple WHERE statements', function() {
    it('should generate a valid group', function() {
      var tokens = tokenize({
        select: ['id'],
        where: {
          and: [
            {
              firstName: 'Test'
            },
            {
              lastName: 'User'
            }
          ]
        },
        from: 'users'
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result,  [
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'id' }
        ],
        [
          { type: 'IDENTIFIER', value: 'WHERE' },
          { type: 'CONDITION', value: 'AND' },
          [
            { type: 'KEY', value: 'firstName' },
            { type: 'VALUE', value: 'Test' },
          ],
          [
            { type: 'KEY', value: 'lastName' },
            { type: 'VALUE', value: 'User' }
          ]
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ]
      ]);
    });

    it('should generate a valid group when used with operators', function() {
      var tokens = tokenize({
        select: ['*'],
        where: {
          and: [
            {
              votes: {
                '>': 100
              }
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
          { type: 'CONDITION', value: 'AND' },
          [
            { type: 'KEY', value: 'votes' },
            { type: 'OPERATOR', value: '>' },
            { type: 'VALUE', value: 100 }
          ]
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ]
      ]);
    });

    it('should generate a valid group when used with multiple operators', function() {
      var tokens = tokenize({
        select: ['*'],
        where: {
          and: [
            {
              votes: {
                '>': 100
              }
            },
            {
              votes: {
                '<': 200
              }
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
          { type: 'CONDITION', value: 'AND' },
          [
            { type: 'KEY', value: 'votes' },
            { type: 'OPERATOR', value: '>' },
            { type: 'VALUE', value: 100 }
          ],
          [
            { type: 'KEY', value: 'votes' },
            { type: 'OPERATOR', value: '<' },
            { type: 'VALUE', value: 200 }
          ]
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ]
      ]);
    });

    it('should generate a valid group when used with multiple columns and operators', function() {
      var tokens = tokenize({
        select: ['*'],
        where: {
          and: [
            {
              votes: {
                '>': 100
              }
            },
            {
              age: {
                '<': 50
              }
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
          { type: 'CONDITION', value: 'AND' },
          [
            { type: 'KEY', value: 'votes' },
            { type: 'OPERATOR', value: '>' },
            { type: 'VALUE', value: 100 }
          ],
          [
            { type: 'KEY', value: 'age' },
            { type: 'OPERATOR', value: '<' },
            { type: 'VALUE', value: 50 }
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
