var runBenchmarks = require('../support/benchmark-runner');
var analyze = require('../support/analyze');
var sqlBuilder = require('../../index')({
  dialect: 'postgres'
});

//  ╔╗ ╔═╗╔╗╔╔═╗╦ ╦╔╦╗╔═╗╦═╗╦╔═╔═╗
//  ╠╩╗║╣ ║║║║  ╠═╣║║║╠═╣╠╦╝╠╩╗╚═╗
//  ╚═╝╚═╝╝╚╝╚═╝╩ ╩╩ ╩╩ ╩╩╚═╩ ╩╚═╝
describe('Benchmark :: Sequelizer', function() {
  // Set "timeout" and "slow" thresholds incredibly high
  // to avoid running into issues.
  this.slow(240000);
  this.timeout(240000);

  var trees = {};

  // Analyzer all the test inputs before running benchmarks
  before(function() {
    trees.select = analyze({
      select: ['*'],
      from: 'books'
    });

    trees.insert = analyze({
      insert: {
        title: 'Slaughterhouse Five'
      },
      into: 'books'
    });

    trees.update = analyze({
      update: {
        status: 'archived'
      },
      where: {
        publishedDate: { '>': 2000 }
      },
      using: 'books'
    });

    trees.delete = analyze({
      del: true,
      from: 'accounts',
      where: {
        activated: false
      }
    });
  });

  it('should be performant enough', function() {
    runBenchmarks('Sequelizer.execSync()', [
      function sequelizerSelect() {
        sqlBuilder.sequelizer(trees.select);
      },

      function sequelizerInsert() {
        sqlBuilder.sequelizer(trees.insert);
      },

      function sequelizerUpdate() {
        sqlBuilder.sequelizer(trees.update);
      },

      function sequelizerDelete() {
        sqlBuilder.sequelizer(trees.delete);
      }
    ]);
  });
});
