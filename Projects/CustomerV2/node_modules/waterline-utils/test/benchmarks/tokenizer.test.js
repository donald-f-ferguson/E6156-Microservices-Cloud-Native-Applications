var runBenchmarks = require('../support/benchmark-runner');
var Tokenizer = require('../../index').query.tokenizer;

//  ╔╗ ╔═╗╔╗╔╔═╗╦ ╦╔╦╗╔═╗╦═╗╦╔═╔═╗
//  ╠╩╗║╣ ║║║║  ╠═╣║║║╠═╣╠╦╝╠╩╗╚═╗
//  ╚═╝╚═╝╝╚╝╚═╝╩ ╩╩ ╩╩ ╩╩╚═╩ ╩╚═╝
describe('Benchmark :: Tokenizer', function() {
  // Set "timeout" and "slow" thresholds incredibly high
  // to avoid running into issues.
  this.slow(240000);
  this.timeout(240000);

  it('should be performant enough', function() {
    runBenchmarks('Tokenizer', [
      function buildSelectTokenSet() {
        Tokenizer({
          select: '*',
          from: 'books'
        });
      },

      function buildInsertTokenSet() {
        Tokenizer({
          insert: {
            title: 'Slaughterhouse Five'
          },
          into: 'books'
        });
      },

      function buildUpdateTokenSet() {
        Tokenizer({
          update: {
            status: 'archived'
          },
          where: {
            publishedDate: { '>': 2000 }
          },
          using: 'books'
        });
      },

      function buildDeleteTokenSet() {
        Tokenizer({
          del: true,
          from: 'accounts',
          where: {
            activated: false
          }
        });
      }
    ]);
  });
});
