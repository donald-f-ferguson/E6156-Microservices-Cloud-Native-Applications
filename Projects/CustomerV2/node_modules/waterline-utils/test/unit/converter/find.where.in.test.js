var Test = require('../../support/convert-runner');

describe('Converter ::', function() {
  describe('FIND WHERE IN statements', function() {
    it('should generate a query', function() {
      Test({
        criteria: {
          model: 'user',
          method: 'find',
          criteria: {
            where: {
              id: {
                in: [1, 2, 3]
              }
            }
          }
        },
        query: {
          select: [],
          from: 'user',
          where: {
            id: {
              in: [1, 2, 3]
            }
          }
        }
      });
    });

    it('should generate a query when inside an OR statement', function() {
      Test({
        criteria: {
          model: 'user',
          method: 'find',
          criteria: {
            where: {
              or: [
                {
                  id: {
                    in: [1, 2, 3]
                  }
                },
                {
                  id: {
                    in: [4, 5, 6]
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
            or: [
              {
                id: {
                  in: [1, 2, 3]
                }
              },
              {
                id: {
                  in: [4, 5, 6]
                }
              }
            ]
          }
        }
      });
    });
  });
});
