/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');


/**
 * Expand the provided test suite with more tests automatically.
 *
 * @param  {Array} testSuite
 * @return {Array}
 */
module.exports = function expandSuite ( testSuite ) {

  // For all `example: undefined` tests, also test `example: '==='`
  var starTests = [];
  _.each(testSuite, function (test){
    if (_.isUndefined(test.example)) {
      var newTest = {
        example: '===',
        actual: test.actual
      };
      if (test.hasOwnProperty('result')) {
        newTest.result = test.result;
      }
      if (test.hasOwnProperty('strictEq')) {
        newTest.strictEq = _.cloneDeep(test.strictEq);
      }
      if (test.hasOwnProperty('isNew')) {
        newTest.isNew = _.cloneDeep(test.isNew);
      }
      starTests.push(newTest);
    }
  });
  testSuite = testSuite.concat(starTests);

  // Lodash 3.0 deprecated prototypal cloning of things like Errors
  // (so we shim a quick version for our purposes)
  var customCloneDeep = function (val){
    return _.cloneDeep(val, function(_val) {
      // Don't worry about cloning most things that _.cloneDeep would
      // normally reject; instead just pass them straight through.
      if (_.isError(_val)) {
        return _val;
      }
      else if (_.isFunction(_val)) {
        return _val;
      }
      else if (_.isObject(_val) && _val instanceof Buffer) {
        return _val;
      }
      else if (_.isObject(_val) && _val instanceof require('stream').Readable) {
        return _val;
      }
      // Otherwise allow vanilla _.cloneDeep() behavior:
      else { return undefined; }
    });
  };

  // Inject an extra test for each existing test in order to ensure correct
  // behavior when recursive examples/values are provided
  var recursiveTests = [];
  _.each(testSuite, function (test){

    // ...but skip:
    //  • tests with example: `undefined`
    //  • tests that expect errors
    //  • tests that expect a result===`undefined`
    //  • tests that verify `strictEq` or `isNew`
    // (nested behavior is different in these cases^)
    if (!test.error && !_.isUndefined(test.result) && !test.hasOwnProperty('strictEq') && !test.hasOwnProperty('isNew')) {

      // test one level of additional array nesting
      if (!_.isUndefined(test.actual)) {
        recursiveTests.push({
          example: [ customCloneDeep(test.example) ],
          actual: [ customCloneDeep(test.actual) ],
          result: [ customCloneDeep(test.result) ],
          _meta: '+1 array depth'
        });
      }

      // test one level of additional dictionary nesting
      recursiveTests.push({
        example: { xtra: customCloneDeep(test.example) },
        actual: { xtra: customCloneDeep(test.actual) },
        result: { xtra: customCloneDeep(test.result) },
        _meta: '+1 dictionary depth'
      });

      // test one level of additional dictionary nesting AND 1 level of additional array nesting
      recursiveTests.push({
        example: [ { xtra: customCloneDeep(test.example) } ],
        actual: [ { xtra: customCloneDeep(test.actual) } ],
        result: [ { xtra: customCloneDeep(test.result) } ],
        _meta: '+1 array depth, +1 dictionary depth'
      });

      // test two levels of additional dictionary nesting
      recursiveTests.push({
        example: { xtra: { xtra2: customCloneDeep(test.example) } },
        actual: { xtra: { xtra2: customCloneDeep(test.actual) } },
        result: { xtra:{ xtra2: customCloneDeep(test.result) } },
        _meta: '+2 dictionary depth'
      });

      if (!_.isUndefined(test.actual)) {
        // test two levels of additional array nesting
        recursiveTests.push({
          example: [ [ customCloneDeep(test.example) ] ],
          actual:  [ [ customCloneDeep(test.actual) ] ],
          result:  [ [ customCloneDeep(test.result) ] ],
          _meta: '+2 array depth'
        });
      }

      // test two levels of additional dictionary nesting AND 1 level of array nesting
      recursiveTests.push({
        example: [ { xtra: { xtra2: customCloneDeep(test.example) } } ],
        actual: [ { xtra: { xtra2: customCloneDeep(test.actual) } } ],
        result: [ { xtra:{ xtra2: customCloneDeep(test.result) } } ],
        _meta: '+1 array depth, +2 dictionary depth'
      });

      // test two levels of additional dictionary nesting and one level of array nesting, then WITHIN that, 1 level of array nesting
      if (!_.isUndefined(test.actual)) {
        recursiveTests.push({
          example: [ { xtra: { xtra2: [customCloneDeep(test.example)] } } ],
          actual: [ { xtra: { xtra2: [customCloneDeep(test.actual)] } } ],
          result: [ { xtra:{ xtra2: [customCloneDeep(test.result)] } } ],
          _meta: '+1 array depth, +2 dictionary depth, +1 nested array depth'
        });
      }

      if (!_.isUndefined(test.actual)) {
        // test two levels of additional dictionary nesting and one level of array nesting, then WITHIN that, 2 levels of array nesting
        recursiveTests.push({
          example: [ { xtra: { xtra2: [[customCloneDeep(test.example)]] } } ],
          actual: [ { xtra: { xtra2: [[customCloneDeep(test.actual)]] } } ],
          result: [ { xtra:{ xtra2: [[customCloneDeep(test.result)]] } } ],
          _meta: '+1 array depth, +2 dictionary depth, +2 nested array depth'
        });
      }
    }

  });
  testSuite = testSuite.concat(recursiveTests);

  return testSuite;
};
