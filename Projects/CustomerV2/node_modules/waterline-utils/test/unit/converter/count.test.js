var Test = require('../../support/convert-runner');

describe('Converter :: ', function() {
  describe('Count :: ', function() {
    it('should generate a count query', function() {
      Test({
        criteria: {
          model: 'user',
          method: 'count',
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
          }
        },
        query: {
          count: true,
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
