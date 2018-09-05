var Tokenizer = require('../../../index').query.tokenizer;
var assert = require('assert');

describe('Tokenizer ::', function() {
  describe('Union All ::', function() {
    it('should generate a valid token array for a UNIONALL array', function() {
      var result = Tokenizer({
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

      assert.deepEqual(result,  [
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: '*' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'AND' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'firstName' },
        { type: 'VALUE', value: 'Bob' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'ENDCONDITION', value: 'AND' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' },
        { type: 'UNION', value: 'UNIONALL' },
        { type: 'GROUP', value: 0 },
        { type: 'SUBQUERY', value: null },
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: '*' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'AND' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'lastName' },
        { type: 'VALUE', value: 'Smith' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'ENDCONDITION', value: 'AND' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' },
        { type: 'ENDSUBQUERY', value: null },
        { type: 'ENDGROUP', value: 0 },
        { type: 'GROUP', value: 1 },
        { type: 'SUBQUERY', value: null },
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: '*' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'AND' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'middleName' },
        { type: 'VALUE', value: 'Allen' },
        { type: 'ENDGROUP', value: 0 },
        { type: 'ENDCONDITION', value: 'AND' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' },
        { type: 'ENDSUBQUERY', value: null },
        { type: 'ENDGROUP', value: 1 },
        { type: 'ENDUNION', value: 'UNIONALL' }
      ]);
    });

    it('should generate a valid token array for a UNIONALL array with nested where clause', function() {
      var result = Tokenizer({
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

      assert.deepEqual(result,  [
        { type: 'UNION', value: 'UNIONALL' },
        { type: 'GROUP', value: 0 },
        { type: 'SUBQUERY', value: null },
        { type: 'IDENTIFIER', value: 'SELECT' },
        { type: 'VALUE', value: '*' },
        { type: 'ENDIDENTIFIER', value: 'SELECT' },
        { type: 'IDENTIFIER', value: 'FROM' },
        { type: 'VALUE', value: 'users' },
        { type: 'ENDIDENTIFIER', value: 'FROM' },
        { type: 'IDENTIFIER', value: 'ORDERBY' },
        { type: 'KEY', value: 'id' },
        { type: 'VALUE', value: 'ASC' },
        { type: 'ENDIDENTIFIER', value: 'ORDERBY' },
        { type: 'IDENTIFIER', value: 'WHERE' },
        { type: 'CONDITION', value: 'AND' },
        { type: 'GROUP', value: 0 },
        { type: 'KEY', value: 'isDeleted' },
        { type: 'VALUE', value: false },
        { type: 'ENDGROUP', value: 0 },
        { type: 'GROUP', value: 1 },
        { type: 'KEY', value: 'lastName' },
        { type: 'OPERATOR', value: 'like' },
        { type: 'VALUE', value: '%a%' },
        { type: 'ENDOPERATOR', value: 'like' },
        { type: 'ENDGROUP', value: 1 },
        { type: 'ENDCONDITION', value: 'AND' },
        { type: 'ENDIDENTIFIER', value: 'WHERE' },
        { type: 'ENDSUBQUERY', value: null },
        { type: 'ENDGROUP', value: 0 },
        { type: 'ENDUNION', value: 'UNIONALL' }
      ]);
    });
  });
});
