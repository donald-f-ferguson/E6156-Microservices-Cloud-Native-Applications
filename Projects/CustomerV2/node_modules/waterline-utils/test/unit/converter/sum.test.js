var Test = require('../../support/convert-runner');

describe('Converter :: ', function() {
  describe('Sums :: ', function() {
    it('should generate a sum query', function() {
      Test({
        criteria: {
          model: 'user',
          method: 'sum',
          criteria: {
            where: {
              and: [
                {
                  firstName: 'Test'
                },
                {
                  lastName: 'User'
                }
              ]
            }
          },
          values: 'age'
        },
        query: {
          sum: 'age',
          from: 'user',
          where: {
            and: [
              {
                firstName: 'Test'
              },
              {
                lastName: 'User'
              }
            ]
          }
        }
      });
    });
  });
});
