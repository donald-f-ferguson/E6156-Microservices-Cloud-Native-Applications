var runBenchmarks = require('../support/benchmark-runner');
var Tokenizer = require('../../index').query.tokenizer;
var Analyzer = require('../../index').query.analyzer;

//  ╔╗ ╔═╗╔╗╔╔═╗╦ ╦╔╦╗╔═╗╦═╗╦╔═╔═╗
//  ╠╩╗║╣ ║║║║  ╠═╣║║║╠═╣╠╦╝╠╩╗╚═╗
//  ╚═╝╚═╝╝╚╝╚═╝╩ ╩╩ ╩╩ ╩╩╚═╩ ╩╚═╝
describe('Benchmark :: Parse', function() {
  // Set "timeout" and "slow" thresholds incredibly high
  // to avoid running into issues.
  this.slow(240000);
  this.timeout(240000);

  it('should be performant enough', function() {
    runBenchmarks('Parse query and return token set', [
      function analyzeSelectSet() {
        var tokens = Tokenizer({
          select: '*',
          from: 'books'
        });

        Analyzer(tokens);
      },

      function analyzeInsertSet() {
        var tokens = Tokenizer({
          insert: {
            title: 'Slaughterhouse Five'
          },
          into: 'books'
        });

        Analyzer(tokens);
      },

      function analyzeUpdateSet() {
        var tokens = Tokenizer({
          update: {
            status: 'archived'
          },
          where: {
            publishedDate: { '>': 2000 }
          },
          using: 'books'
        });

        Analyzer(tokens);
      },

      function analyzeDeleteSet() {
        var tokens = Tokenizer({
          del: true,
          from: 'accounts',
          where: {
            activated: false
          }
        });

        Analyzer(tokens);
      }
    ]);
  });
});
