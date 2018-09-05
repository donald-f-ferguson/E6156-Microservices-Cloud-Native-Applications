var Test = require('../../support/convert-runner');

describe('Converter :: ', function() {
  describe('Find Where Not :: ', function() {
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
                    '!=': 40
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
                  '!=': 40
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
                    '!=': 40
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
                  '!=': 40
                }
              }
            ]
          }
        }
      });
    });

    it('should allow flexibility in usage', function() {
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
                    '!=': 40
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
                  '!=': 40
                }
              }
            ]
          }
        }
      });
    });
  });
});
