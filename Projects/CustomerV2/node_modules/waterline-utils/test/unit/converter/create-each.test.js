var Test = require('../../support/convert-runner');

describe('Converter :: ', function() {
  describe('Create Each :: ', function() {
    it('should generate a create each query', function() {
      Test({
        criteria: {
          model: 'user',
          method: 'createEach',
          values: [
            {
              firstName: 'foo'
            },
            {
              firstName: 'bar'
            }
          ]
        },
        query: {
          insert: [
            {
              firstName: 'foo'
            },
            {
              firstName: 'bar'
            }
          ],
          into: 'user'
        }
      });
    });
  });
});
