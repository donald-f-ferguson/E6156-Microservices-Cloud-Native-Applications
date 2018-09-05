var runBenchmarks = require('../support/benchmark-runner');
var Tokenizer = require('../../index').query.tokenizer;
var Analyzer = require('../../index').query.analyzer;

//  ╔╗ ╔═╗╔╗╔╔═╗╦ ╦╔╦╗╔═╗╦═╗╦╔═╔═╗
//  ╠╩╗║╣ ║║║║  ╠═╣║║║╠═╣╠╦╝╠╩╗╚═╗
//  ╚═╝╚═╝╝╚╝╚═╝╩ ╩╩ ╩╩ ╩╩╚═╩ ╩╚═╝
describe('Benchmark :: Analyzer', function() {
  // Set "timeout" and "slow" thresholds incredibly high
  // to avoid running into issues.
  this.slow(240000);
  this.timeout(240000);

  var tokens = {};

  // Tokenize all the test inputs before running benchmarks
  before(function() {
    tokens.select = Tokenizer({
      select: '*',
      from: 'books'
    });

    tokens.insert = Tokenizer({
      insert: {
        title: 'Slaughterhouse Five'
      },
      into: 'books'
    });

    tokens.update = Tokenizer({
      update: {
        status: 'archived'
      },
      where: {
        publishedDate: { '>': 2000 }
      },
      using: 'books'
    });

    tokens.delete = Tokenizer({
      del: true,
      from: 'accounts',
      where: {
        activated: false
      }
    });
  });

  it('should be performant enough', function() {
    runBenchmarks('Analyzer', [
      function analyzeSelectSet() {
        Analyzer(tokens.select);
      },

      function analyzeInsertSet() {
        Analyzer(tokens.insert);
      },

      function analyzeUpdateSet() {
        Analyzer(tokens.update);
      },

      function analyzeDeleteSet() {
        Analyzer(tokens.delete);
      }
    ]);
  });
});
