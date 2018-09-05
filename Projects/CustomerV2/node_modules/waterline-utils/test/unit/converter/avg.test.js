var Test = require('../../support/convert-runner');

describe('Converter :: ', function() {
  describe('Averages :: ', function() {
    it('should generate a avg query', function() {
      Test({
        criteria: {
          model: 'user',
          method: 'avg',
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
          avg: 'age',
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
