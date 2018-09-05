var Analyzer = require('../../../index').query.analyzer;
var tokenize = require('../../support/tokenize');
var assert = require('assert');

describe('Analyzer ::', function() {
  describe('Aggregations', function() {
    it('should generate a valid group when when GROUP BY is used', function() {
      var tokens = tokenize({
        select: ['*'],
        from: 'users',
        groupBy: 'count'
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result,  [
        [
          { type: 'IDENTIFIER', value: 'SELECT' },
          { type: 'VALUE', value: '*' }
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ],
        [
          { type: 'IDENTIFIER', value: 'GROUPBY' },
          { type: 'VALUE', value: 'count' }
        ]
      ]);
    });

    it('should generate a valid group when when MIN is used', function() {
      var tokens = tokenize({
        min: 'active',
        from: 'users'
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result,  [
        [
          { type: 'IDENTIFIER', value: 'MIN' },
          { type: 'VALUE', value: 'active' }
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ]
      ]);
    });

    it('should generate a valid group when when MAX is used', function() {
      var tokens = tokenize({
        max: 'active',
        from: 'users'
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result,  [
        [
          { type: 'IDENTIFIER', value: 'MAX' },
          { type: 'VALUE', value: 'active' }
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ]
      ]);
    });

    it('should generate a valid group when when SUM is used', function() {
      var tokens = tokenize({
        sum: 'active',
        from: 'users'
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result,  [
        [
          { type: 'IDENTIFIER', value: 'SUM' },
          { type: 'VALUE', value: 'active' }
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ]
      ]);
    });

    it('should generate a valid group when when AVG is used', function() {
      var tokens = tokenize({
        avg: 'active',
        from: 'users'
      });

      var result = Analyzer(tokens);

      assert.deepEqual(result,  [
        [
          { type: 'IDENTIFIER', value: 'AVG' },
          { type: 'VALUE', value: 'active' }
        ],
        [
          { type: 'IDENTIFIER', value: 'FROM' },
          { type: 'VALUE', value: 'users' }
        ]
      ]);
    });
  });
});
