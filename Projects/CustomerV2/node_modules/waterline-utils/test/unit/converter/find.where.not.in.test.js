var Test = require('../../support/convert-runner');

describe('Converter :: ', function() {
  describe('Find Where Not In :: ', function() {
    it('should generate a find query', function() {
      Test({
        criteria: {
          model: 'user',
          method: 'find',
          criteria: {
            where: {
              and: [
                {
                  firstName: 'Test'
                },
                {
                  age: {
                    nin: [40, 20, 10]
                  }
                }
              ]
            }
          }
        },
        query: {
          select: [],
          from: 'user',
          where: {
            and: [
              {
                firstName: 'Test'
              },
              {
                age: {
                  nin: [40, 20, 10]
                }
              }
            ]
          }
        }
      });
    });

    it('should generate a find query when the NOT is a legacy value', function() {
      Test({
        criteria: {
          model: 'user',
          method: 'find',
          criteria: {
            where: {
              and: [
                {
                  firstName: 'Test'
                },
                {
                  age: {
                    nin: [40, 20, 10]
                  }
                }
              ]
            }
          }
        },
        query: {
          select: [],
          from: 'user',
          where: {
            and: [
              {
                firstName: 'Test'
              },
              {
                age: {
                  nin: [40, 20, 10]
                }
              }
            ]
          }
        }
      });
    });
  });
});
