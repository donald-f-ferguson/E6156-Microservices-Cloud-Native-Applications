var Test = require('../../support/convert-runner');

describe('Converter :: ', function() {
  describe('Create :: ', function() {
    it('should generate a create query', function() {
      Test({
        criteria: {
          model: 'user',
          method: 'create',
          values: {
            firstName: 'foo'
          }
        },
        query: {
          insert: {
            firstName: 'foo'
          },
          into: 'user'
        }
      });
    });

    it('should generate a create query with multiple values', function() {
      Test({
        criteria: {
          model: 'user',
          method: 'create',
          values: {
            firstName: 'foo',
            lastName: 'bar'
          }
        },
        query: {
          insert: {
            firstName: 'foo',
            lastName: 'bar'
          },
          into: 'user'
        }
      });
    });
  });
});
