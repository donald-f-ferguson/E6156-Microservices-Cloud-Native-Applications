var Analyzer = require('../../../index').query.analyzer;
var tokenize = require('../../support/tokenize');
var assert = require('assert');

describe('Analyzer ::', function() {
  describe('UNION ALL statements', function() {
    it('should generate a valid group for UNIONALL statements', function() {
      var tokens = tokenize({
        select: ['*'],
        from: 'users',
        where: {
          and: [
            {
              firstName: 'Bob'
            }
          ]
        },
        unionAll: [
          {
            select: ['*'],
            from: 'users',
            where: {
              and: [
                {
                  lastName: 'Smith'
                }
              ]
            }
          },
          {
            select: ['*'],
            from: 'users',
            where: {
              and: [
                {
                  middleName: 'Allen'
                }
              ]
            }
          }
        ]
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
          { type: 'CONDITION', value: 'AND' },
          [
            { type: 'KEY', value: 'firstName' },
            { type: 'VALUE', value: 'Bob' }
          ]
        ],
        [
          { type: 'UNION', value: 'UNIONALL' },
          [
            [
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
                { type: 'CONDITION', value: 'AND' },
                [
                  { type: 'KEY', value: 'lastName' },
                  { type: 'VALUE', value: 'Smith' }
                ]
              ]
            ],
            [
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
                { type: 'CONDITION', value: 'AND' },
                [
                  { type: 'KEY', value: 'middleName' },
                  { type: 'VALUE', value: 'Allen' }
                ]
              ]
            ]
          ]
        ]
      ]);
    });

    it('should generate a valid group with joins inside UNIONALL statements', function() {
      var tokens = tokenize({
        select: ['*'],
        from: 'users',
        where: {
          and: [
            {
              firstName: 'Bob'
            }
          ]
        },
        unionAll: [
          {
            select: ['*'],
            from: 'users',
            where: {
              and: [
                {
                  lastName: 'Smith'
                }
              ]
            },
            join: [
              {
                from: 'books',
                on: {
                  books: 'book_id',
                  users: 'id'
                }
              }
            ]
          },
          {
            select: ['*'],
            from: 'users',
            where: {
              and: [
                {
                  middleName: 'Allen'
                }
              ]
            },
            join: [
              {
                from: 'books',
                on: {
                  books: 'book_id',
                  users: 'id'
                }
              }
            ]
          }
        ]
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
          { type: 'CONDITION', value: 'AND' },
          [
            { type: 'KEY', value: 'firstName' },
            { type: 'VALUE', value: 'Bob' }
          ]
        ],
        [
          { type: 'UNION', value: 'UNIONALL' },
          [
            [
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
                { type: 'CONDITION', value: 'AND' },
                [
                  { type: 'KEY', value: 'lastName' },
                  { type: 'VALUE', value: 'Smith' }
                ]
              ],
              [
                { type: 'IDENTIFIER', value: 'JOIN' },
                [
                  { type: 'KEY', value: 'TABLE' },
                  { type: 'VALUE', value: 'books' },
                  { type: 'KEY', value: 'TABLE_KEY' },
                  { type: 'VALUE', value: 'books' },
                  { type: 'KEY', value: 'COLUMN_KEY' },
                  { type: 'VALUE', value: 'book_id' },
                  { type: 'KEY', value: 'TABLE_KEY' },
                  { type: 'VALUE', value: 'users' },
                  { type: 'KEY', value: 'COLUMN_KEY' },
                  { type: 'VALUE', value: 'id' }
                ]
              ]
            ],
            [
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
                { type: 'CONDITION', value: 'AND' },
                [
                  { type: 'KEY', value: 'middleName' },
                  { type: 'VALUE', value: 'Allen' }
                ]
              ],
              [
                { type: 'IDENTIFIER', value: 'JOIN' },
                [
                  { type: 'KEY', value: 'TABLE' },
                  { type: 'VALUE', value: 'books' },
                  { type: 'KEY', value: 'TABLE_KEY' },
                  { type: 'VALUE', value: 'books' },
                  { type: 'KEY', value: 'COLUMN_KEY' },
                  { type: 'VALUE', value: 'book_id' },
                  { type: 'KEY', value: 'TABLE_KEY' },
                  { type: 'VALUE', value: 'users' },
                  { type: 'KEY', value: 'COLUMN_KEY' },
                  { type: 'VALUE', value: 'id' }
                ]
              ]
            ]
          ]
        ]
      ]);
    });

    it('should generate a valid group for UNIONALL statements with nested WHERE criteria', function() {
      var tokens = tokenize({
        unionAll: [
          {
            select: '*',
            from: 'users',
            orderBy: [
              {
                id: 'ASC'
              }
            ],
            where: {
              and: [
                {
                  isDeleted: false
                },
                {
                  lastName: {
                    like: '%a%'
                  }
                }
              ]
            }
          }
        ]
      });

      var result = Analyzer(tokens);
      assert.deepEqual(result, [
        [
          { type: 'UNION', value: 'UNIONALL' },
          [
            [
              [
                { type: 'IDENTIFIER', value: 'SELECT' },
                { type: 'VALUE', value: '*' }
              ],
              [
                { type: 'IDENTIFIER', value: 'FROM' },
                { type: 'VALUE', value: 'users' }
              ],
              [
                { type: 'IDENTIFIER', value: 'ORDERBY' },
                { type: 'KEY', value: 'id' },
                { type: 'VALUE', value: 'ASC' }
              ],
              [
                { type: 'IDENTIFIER', value: 'WHERE' },
                { type: 'CONDITION', value: 'AND' },
                [
                  { type: 'KEY', value: 'isDeleted' },
                  { type: 'VALUE', value: false }
                ],
                [
                  { type: 'KEY', value: 'lastName' },
                  { type: 'OPERATOR', value: 'like' },
                  { type: 'VALUE', value: '%a%' }
                ]
              ]
            ]
          ]
        ]
      ]);
    });
  });
});
