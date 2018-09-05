var Test = require('../../support/convert-runner');

describe('Converter :: ', function() {
  describe('Find Where :: ', function() {
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
                  lastName: 'User'
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
                lastName: 'User'
              }
            ]
          }
        }
      });
    });

    it('should work with operators', function() {
      Test({
        criteria: {
          model: 'user',
          method: 'find',
          criteria: {
            where: {
              votes: {
                '>': 100
              }
            }
          }
        },
        query: {
          select: [],
          from: 'user',
          where: {
            votes: {
              '>': 100
            }
          }
        }
      });
    });

    it('should work with multiple operators', function() {
      Test({
        criteria: {
          model: 'user',
          method: 'find',
          criteria: {
            where: {
              and: [
                {
                  votes: {
                    '>': 100
                  }
                },
                {
                  age: {
                    '<': 50
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
                votes: {
                  '>': 100
                }
              },
              {
                age: {
                  '<': 50
                }
              }
            ]
          }
        }
      });
    });
  });
});
