var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('Subqueries ::', function() {
    describe('used as a predicate', function() {
      it('should generate a valid token array for an IN subquery', function() {
        var result = Tokenizer({
          select: ['*'],
          from: 'accounts',
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
          }
        });

        assert.deepEqual(result,  [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: '*' },
          { type: 'ENDIDENTIFIER', value: 'SELECT' },
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'accounts' },
          { type: 'ENDIDENTIFIER', value: 'FROM' },
          { type: 'IDENTIFIER', value: 'WHERE' },
          { type: 'CONDITION', value: 'AND' },
          { type: 'GROUP', value: 0 },
          { type: 'KEY', value: 'id' },
          { type: 'CONDITION', value: 'IN' },
          { type: 'SUBQUERY', value: null },
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'id' },
          { type: 'ENDIDENTIFIER', value: 'SELECT' },
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' },
          { type: 'ENDIDENTIFIER', value: 'FROM' },
          { type: 'IDENTIFIER', value: 'WHERE' },
          { type: 'CONDITION', value: 'OR' },
          { type: 'GROUP', value: 0 },
          { type: 'KEY', value: 'status' },
          { type: 'VALUE', value: 'active' },
          { type: 'ENDGROUP', value: 0 },
          { type: 'GROUP', value: 1 },
          { type: 'KEY', value: 'name' },
          { type: 'VALUE', value: 'John' },
          { type: 'ENDGROUP', value: 1 },
          { type: 'ENDCONDITION', value: 'OR' },
          { type: 'ENDIDENTIFIER', value: 'WHERE' },
          { type: 'ENDSUBQUERY', value: null },
          { type: 'ENDCONDITION', value: 'IN' },
          { type: 'ENDGROUP', value: 0 },
          { type: 'ENDCONDITION', value: 'AND' },
          { type: 'ENDIDENTIFIER', value: 'WHERE' }
        ]);
      });

      it('should generate a valid token array for a NOT IN subquery', function() {
        var result = Tokenizer({
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

        assert.deepEqual(result,  [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: '*' },
          { type: 'ENDIDENTIFIER', value: 'SELECT' },
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'accounts' },
          { type: 'ENDIDENTIFIER', value: 'FROM' },
          { type: 'IDENTIFIER', value: 'WHERE' },
          { type: 'CONDITION', value: 'AND' },
          { type: 'GROUP', value: 0 },
          { type: 'KEY', value: 'id' },
          { type: 'CONDITION', value: 'NOTIN' },
          { type: 'SUBQUERY', value: null },
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'id' },
          { type: 'ENDIDENTIFIER', value: 'SELECT' },
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' },
          { type: 'ENDIDENTIFIER', value: 'FROM' },
          { type: 'IDENTIFIER', value: 'WHERE' },
          { type: 'CONDITION', value: 'OR' },
          { type: 'GROUP', value: 0 },
          { type: 'KEY', value: 'status' },
          { type: 'VALUE', value: 'active' },
          { type: 'ENDGROUP', value: 0 },
          { type: 'GROUP', value: 1 },
          { type: 'KEY', value: 'name' },
          { type: 'VALUE', value: 'John' },
          { type: 'ENDGROUP', value: 1 },
          { type: 'ENDCONDITION', value: 'OR' },
          { type: 'ENDIDENTIFIER', value: 'WHERE' },
          { type: 'ENDSUBQUERY', value: null },
          { type: 'ENDCONDITION', value: 'NOTIN' },
          { type: 'ENDGROUP', value: 0 },
          { type: 'ENDCONDITION', value: 'AND' },
          { type: 'ENDIDENTIFIER', value: 'WHERE' }
        ]);
      });
    }); // </ predicate >

    describe('used as scalar values', function() {
      it('should generate a valid token array when used inside a SELECT', function() {
        var result = Tokenizer({
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

        assert.deepEqual(result,  [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'name' },
          { type: 'ENDIDENTIFIER', value: 'SELECT' },
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'SUBQUERY', value: null },
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'username' },
          { type: 'ENDIDENTIFIER', value: 'SELECT' },
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' },
          { type: 'ENDIDENTIFIER', value: 'FROM' },
          { type: 'IDENTIFIER', value: 'WHERE' },
          { type: 'CONDITION', value: 'OR' },
          { type: 'GROUP', value: 0 },
          { type: 'KEY', value: 'status' },
          { type: 'VALUE', value: 'active' },
          { type: 'ENDGROUP', value: 0 },
          { type: 'GROUP', value: 1 },
          { type: 'KEY', value: 'name' },
          { type: 'VALUE', value: 'John' },
          { type: 'ENDGROUP', value: 1 },
          { type: 'ENDCONDITION', value: 'OR' },
          { type: 'ENDIDENTIFIER', value: 'WHERE' },
          { type: 'IDENTIFIER', value: 'AS' },
          { type: 'VALUE', value: 'username' },
          { type: 'ENDIDENTIFIER', value: 'AS' },
          { type: 'ENDSUBQUERY', value: null },
          { type: 'ENDIDENTIFIER', value: 'SELECT' },
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'age' },
          { type: 'ENDIDENTIFIER', value: 'SELECT' },
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'accounts' },
          { type: 'ENDIDENTIFIER', value: 'FROM' }
        ]);
      });

      it('should generate a valid token array when used as a value in a WHERE', function() {
        var result = Tokenizer({
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

        assert.deepEqual(result,  [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'name' },
          { type: 'ENDIDENTIFIER', value: 'SELECT' },
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'age' },
          { type: 'ENDIDENTIFIER', value: 'SELECT' },
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'accounts' },
          { type: 'ENDIDENTIFIER', value: 'FROM' },
          { type: 'IDENTIFIER', value: 'WHERE' },
          { type: 'CONDITION', value: 'AND' },
          { type: 'GROUP', value: 0 },
          { type: 'KEY', value: 'username' },
          { type: 'SUBQUERY', value: null },
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'username' },
          { type: 'ENDIDENTIFIER', value: 'SELECT' },
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' },
          { type: 'ENDIDENTIFIER', value: 'FROM' },
          { type: 'IDENTIFIER', value: 'WHERE' },
          { type: 'KEY', value: 'color' },
          { type: 'VALUE', value: 'accounts.color' },
          { type: 'ENDIDENTIFIER', value: 'WHERE' },
          { type: 'ENDSUBQUERY', value: null },
          { type: 'ENDGROUP', value: 0 },
          { type: 'ENDCONDITION', value: 'AND' },
          { type: 'ENDIDENTIFIER', value: 'WHERE' }
        ]);
      });
    }); // </ scalar >

    describe('used as table sub query', function() {
      it('should generate a valid token array when used as a value in a FROM with an AS alias', function() {
        var result = Tokenizer({
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

        assert.deepEqual(result,  [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'name' },
          { type: 'ENDIDENTIFIER', value: 'SELECT' },
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'age' },
          { type: 'ENDIDENTIFIER', value: 'SELECT' },
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'SUBQUERY', value: null },
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: 'age' },
          { type: 'ENDIDENTIFIER', value: 'SELECT' },
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' },
          { type: 'ENDIDENTIFIER', value: 'FROM' },
          { type: 'IDENTIFIER', value: 'WHERE' },
          { type: 'CONDITION', value: 'AND' },
          { type: 'GROUP', value: 0 },
          { type: 'KEY', value: 'age' },
          { type: 'VALUE', value: 21 },
          { type: 'ENDGROUP', value: 0 },
          { type: 'ENDCONDITION', value: 'AND' },
          { type: 'ENDIDENTIFIER', value: 'WHERE' },
          { type: 'IDENTIFIER', value: 'AS' },
          { type: 'VALUE', value: 'userage' },
          { type: 'ENDIDENTIFIER', value: 'AS' },
          { type: 'ENDSUBQUERY', value: null },
          { type: 'ENDIDENTIFIER', value: 'FROM' }
        ]);
      });
    }); // </ table >
  });
});
