var Analyzer = require('../../../index').query.analyzer;
var tokenize = require('../../support/tokenize');
var assert = require('assert');

describe('Analyzer ::', function() {
  describe('Various Operators', function() {
    it('should generate a valid group for LIKE operators', function() {
      var tokens = tokenize({
        select: ['*'],
        from: 'users',
        where: {
          or: [
            {
              name: {
                like: '%Test%'
              }
            },
            {
              id: {
                nin: [1, 2, 3]
              }
            }
          ]
        }
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result, [
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: '*' }
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ],
        [
          { type: 'IDENTIFIER', value: 'WHERE' },
          [
            { type: 'KEY', value: 'name' },
            { type: 'OPERATOR', value: 'like' },
            { type: 'VALUE', value: '%Test%' }
          ],
          [
            { type: 'KEY', value: 'id' },
            { type: 'CONDITION', value: 'NOTIN' },
            { type: 'VALUE', value: [1, 2, 3] }
          ]
        ]
      ]);
    });

    it('should generate a valid group for != operators', function() {
      var tokens = tokenize({
        select: ['id'],
        from: 'users',
        where: {
          and: [
            {
              firstName: {
                '!=': 'Test'
              }
            },
            {
              lastName: {
                '!=': 'User'
              }
            }
          ]
        }
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result, [
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'id' }
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ],
        [
          { type: 'IDENTIFIER', value: 'WHERE' },
          { type: 'CONDITION', value: 'AND' },
          [
            { type: 'KEY', value: 'firstName' },
            { type: 'OPERATOR', value: '!=' },
            { type: 'VALUE', value: 'Test' }
          ],
          [
            { type: 'KEY', value: 'lastName' },
            { type: 'OPERATOR', value: '!=' },
            { type: 'VALUE', value: 'User' }
          ]
        ]
      ]);
    });

    it('should generate a valid group for != operators when NULL is used', function() {
      var tokens = tokenize({
        select: ['id'],
        from: 'users',
        where: {
          and: [
            {
              firstName: {
                '!=': null
              }
            },
            {
              lastName: {
                '!=': 'User'
              }
            }
          ]
        }
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result, [
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'id' }
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ],
        [
          { type: 'IDENTIFIER', value: 'WHERE' },
          { type: 'CONDITION', value: 'AND' },
          [
            { type: 'KEY', value: 'firstName' },
            { type: 'OPERATOR', value: '!=' },
            { type: 'VALUE', value: null }
          ],
          [
            { type: 'KEY', value: 'lastName' },
            { type: 'OPERATOR', value: '!=' },
            { type: 'VALUE', value: 'User' }
          ]
        ]
      ]);
    });

    it('should generate a valid group when nested != operators are used', function() {
      var tokens = tokenize({
        select: ['*'],
        from: 'users',
        where: {
          or: [
            {
              or: [
                {
                  id: 1
                },
                {
                  id: {
                    '<': 10
                  }
                }
              ]
            },
            {
              name: {
                '!=': 'Tester'
              }
            }
          ]
        }
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result, [
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: '*' }
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
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
              { type: 'OPERATOR', value: '<' },
              { type: 'VALUE', value: 10 }
            ]
          ],
          [
            { type: 'KEY', value: 'name' },
            { type: 'OPERATOR', value: '!=' },
            { type: 'VALUE', value: 'Tester' }
          ]
        ]
      ]);
    });

    it('should generate a valid group when multiple conditionals are used', function() {
      var tokens = tokenize({
        select: ['*'],
        from: 'users',
        where: {
          or: [
            {
              name: 'John'
            },
            {
              votes: {
                '>': 100
              },
              title: {
                '!=': 'Admin'
              }
            }
          ]
        }
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result, [
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: '*' }
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ],
        [
          { type: 'IDENTIFIER', value: 'WHERE' },
          [
            { type: 'KEY', value: 'name' },
            { type: 'VALUE', value: 'John' }
          ],
          [
            { type: 'KEY', value: 'votes' },
            { type: 'OPERATOR', value: '>' },
            { type: 'VALUE', value: 100 },
            { type: 'KEY', value: 'title' },
            { type: 'OPERATOR', value: '!=' },
            { type: 'VALUE', value: 'Admin' }
          ]
        ]
      ]);
    });
  });
});
