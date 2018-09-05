var runBenchmarks = require('../support/benchmark-runner');
var Converter = require('../../index').query.converter;

//  ╔╗ ╔═╗╔╗╔╔═╗╦ ╦╔╦╗╔═╗╦═╗╦╔═╔═╗
//  ╠╩╗║╣ ║║║║  ╠═╣║║║╠═╣╠╦╝╠╩╗╚═╗
//  ╚═╝╚═╝╝╚╝╚═╝╩ ╩╩ ╩╩ ╩╩╚═╩ ╩╚═╝
describe('Benchmark :: Converter', function() {
  // Set "timeout" and "slow" thresholds incredibly high
  // to avoid running into issues.
  this.slow(240000);
  this.timeout(240000);

  it('should be performant enough', function() {
    runBenchmarks('Converter()', [
      function buildSelectStatement() {
        Converter({
          model: 'user',
          method: 'find',
          criteria: {
            where: {
              firstName: 'Test',
              lastName: 'User'
            }
          }
        });
      },

      function buildInsertStatement() {
        Converter({
          model: 'user',
          method: 'create',
          values: {
            firstName: 'foo'
          }
        });
      },

      function buildUpdateStatement() {
        Converter({
          model: 'user',
          method: 'update',
          criteria: {
            where: {
              firstName: 'Test',
              lastName: 'User'
            }
          },
          values: {
            firstName: 'foo'
          }
        });
      },

      function buildDeleteStatement() {
        Converter({
          model: 'user',
          method: 'delete',
          criteria: {
            where: {
              firstName: 'Test',
              lastName: 'User'
            }
          }
        });
      }
    ]);
  });
});
