var Analyzer = require('../../../index').query.analyzer;
var tokenize = require('../../support/tokenize');
var assert = require('assert');

describe('Analyzer ::', function() {
  describe('Subqueries', function() {
    describe('used as a predicate', function() {
      it('should generate a valid group for an IN subquery', function() {
        var tokens = tokenize({
          select: ['*'],
          where: {
            and: [
              {
                id: {
                  in: {
                    select: ['id'],
                    from: 'users',
                    where: {
                      or: [
                        { status: 'active' },
                        { name: 'John' }
                      ]
                    }
                  }
                }
              }
            ]
          },
          from: 'accounts'
        });

        var result = Analyzer(tokens);

        assert.deepEqual(result, [
          [
            { type: 'IDENTIFIER', value: 'SELECT' },
            { type: 'VALUE', value: '*' }
          ],
          [
            { type: 'IDENTIFIER', value: 'WHERE' },
            { type: 'CONDITION', value: 'AND' },
            [
              { type: 'KEY', value: 'id' },
              { type: 'CONDITION', value: 'IN' },
              { type: 'SUBQUERY', value: null },
              [
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
                  [
                    { type: 'KEY', value: 'status' },
                    { type: 'VALUE', value: 'active' }
                  ],
                  [
                    { type: 'KEY', value: 'name' },
                    { type: 'VALUE', value: 'John' }
                  ]
                ]
              ]
            ]
          ],
          [
            { type: 'IDENTIFIER', value: 'FROM' },
            { type: 'VALUE', value: 'accounts' }
          ]
        ]);
      });

      it('should generate a valid group for a NOT IN subquery', function() {
        var tokens = tokenize({
          select: ['*'],
          from: 'accounts',
          where: {
            and: [
              {
                id: {
                  nin: {
                    select: ['id'],
                    from: 'users',
                    where: {
                      or: [
                        { status: 'active' },
                        { name: 'John' }
                      ]
                    }
                  }
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
            { type: 'VALUE', value: 'accounts' }
          ],
          [
            { type: 'IDENTIFIER', value: 'WHERE' },
            { type: 'CONDITION', value: 'AND' },
            [
              { type: 'KEY', value: 'id' },
              { type: 'CONDITION', value: 'NOTIN' },
              { type: 'SUBQUERY', value: null },
              [
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
                  [
                    { type: 'KEY', value: 'status' },
                    { type: 'VALUE', value: 'active' }
                  ],
                  [
                    { type: 'KEY', value: 'name' },
                    { type: 'VALUE', value: 'John' }
                  ]
                ]
              ]
            ]
          ]
        ]);
      });
    });

    describe('used as scalar values', function() {
      it('should generate a valid group when used inside a SELECT', function() {
        var tokens = tokenize({
          select: ['name', {
            select: ['username'],
            from: 'users',
            where: {
              or: [
                { status: 'active' },
                { name: 'John' }
              ]
            },
            as: 'username'
          }, 'age'],
          from: 'accounts'
        });

        var result = Analyzer(tokens);

        assert.deepEqual(result, [
          [
            { type: 'IDENTIFIER', value: 'SELECT' },
            { type: 'VALUE', value: 'name' }
          ],
          [
            { type: 'IDENTIFIER', value: 'SELECT' },
            { type: 'SUBQUERY', value: null },
            [
              [
                { type: 'IDENTIFIER', value: 'SELECT' },
                { type: 'VALUE', value: 'username' }
              ],
              [
                { type: 'IDENTIFIER', value: 'FROM' },
                { type: 'VALUE', value: 'users' }
              ],
              [
                { type: 'IDENTIFIER', value: 'WHERE' },
                [
                  { type: 'KEY', value: 'status' },
                  { type: 'VALUE', value: 'active' }
                ],
                [
                  { type: 'KEY', value: 'name' },
                  { type: 'VALUE', value: 'John' }
                ]
              ],
              [
                { type: 'IDENTIFIER', value: 'AS' },
                { type: 'VALUE', value: 'username' }
              ]
            ]
          ],
          [
            { type: 'IDENTIFIER', value: 'SELECT' },
            { type: 'VALUE', value: 'age' }
          ],
          [
            { type: 'IDENTIFIER', value: 'FROM' },
            { type: 'VALUE', value: 'accounts' }
          ]
        ]);
      });

      it('should generate a valid group when used as a value in a WHERE', function() {
        var tokens = tokenize({
          select: ['name', 'age'],
          from: 'accounts',
          where: {
            and: [
              {
                username: {
                  select: ['username'],
                  from: 'users',
                  where: {
                    color: 'accounts.color'
                  }
                }
              }
            ]
          }
        });

        var result = Analyzer(tokens);

        assert.deepEqual(result, [
          [
            { type: 'IDENTIFIER', value: 'SELECT' },
            { type: 'VALUE', value: 'name' }
          ],
          [
            { type: 'IDENTIFIER', value: 'SELECT' },
            { type: 'VALUE', value: 'age' }
          ],
          [
            { type: 'IDENTIFIER', value: 'FROM' },
            { type: 'VALUE', value: 'accounts' }
          ],
          [
            { type: 'IDENTIFIER', value: 'WHERE' },
            { type: 'CONDITION', value: 'AND' },
            [
              { type: 'KEY', value: 'username' },
              { type: 'SUBQUERY', value: null },
              [
                [
                  { type: 'IDENTIFIER', value: 'SELECT' },
                  { type: 'VALUE', value: 'username' }
                ],
                [
                  { type: 'IDENTIFIER', value: 'FROM' },
                  { type: 'VALUE', value: 'users' }
                ],
                [
                  { type: 'IDENTIFIER', value: 'WHERE' },
                  { type: 'KEY', value: 'color' },
                  { type: 'VALUE', value: 'accounts.color' }
                ]
              ]
            ]
          ]
        ]);
      });
    });

    describe('used as table sub query', function() {
      it('should generate a valid group when used as a value in a FROM with an AS alias', function() {
        var tokens = tokenize({
          select: ['name', 'age'],
          from: {
            select: ['age'],
            from: 'users',
            where: {
              and: [
                {
                  age: 21
                }
              ]
            },
            as: 'userage'
          }
        });

        var result = Analyzer(tokens);

        assert.deepEqual(result, [
          [
            { type: 'IDENTIFIER', value: 'SELECT' },
            { type: 'VALUE', value: 'name' }
          ],
          [
            { type: 'IDENTIFIER', value: 'SELECT' },
            { type: 'VALUE', value: 'age' }
          ],
          [
            { type: 'IDENTIFIER', value: 'FROM' },
            { type: 'SUBQUERY', value: null },
            [
              [
                { type: 'IDENTIFIER', value: 'SELECT' },
                { type: 'VALUE', value: 'age' }
              ],
              [
                { type: 'IDENTIFIER', value: 'FROM' },
                { type: 'VALUE', value: 'users' }
              ],
              [
                { type: 'IDENTIFIER', value: 'WHERE' },
                { type: 'CONDITION', value: 'AND' },
                [
                  { type: 'KEY', value: 'age' },
                  { type: 'VALUE', value: 21 }
                ]
              ],
              [
                { type: 'IDENTIFIER', value: 'AS' },
                { type: 'VALUE', value: 'userage' }
              ]
            ]
          ]
        ]);
      });
    });
  });
});
