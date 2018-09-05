/**
 * Module dependencies
 */

var util = require('util');
var _ = require('@sailshq/lodash');
var getDisplayType = require('../../lib/get-display-type');

module.exports = function runSuite( testSuite, runTestFn ){

  // Run each test.
  _.each(testSuite, function (test){
    describeAndExecuteTest(test, runTestFn);
  });

};

/**
 * Describe a mocha test based on the provided definition.
 *
 * @param  {[type]} test [description]
 * @return {[type]}      [description]
 */
function describeAndExecuteTest(test, runTestFn){

  if (test.strictEq && test.isNew) {
    throw new Error('INVALID TEST: `isNew` and `strictEq` are mutually exclusive opposites- cannot use them together.  For reference, this is test:\n'+util.inspect(test, false, null));
  }

  var actualDisplayName = getDisplayVal(test.actual);

  describe((function _determineDescribeMsg(){
    var msg = '';

    if (test._meta) {
      msg += '['+test._meta+']';
    }
    else {
      msg += ' ';
    }


    if (!_.isUndefined(test.example)) {
      msg += 'with a '+getDisplayType(test.example)+' example ('+getDisplayVal(test.example)+')';
    }
    else if (!_.isUndefined(test.typeclass)) {
      msg += 'with typeclass===`'+test.typeclass+'`';
    }
    else {
      msg +='with example===`undefined`';
    }
    return msg;
  })(), function suite (){
    if (test.error) {
      it(util.format('should error when %s is provided', actualDisplayName), function (done){
        runTestFn(test, done);
      });
      return;
    }

    var itMsg = 'should ';
    if (test.strictEq) {
      itMsg+='maintain strict equality (===) when ' + actualDisplayName + ' is provided';
    }
    else if (test.isNew) {
      if (test.hasOwnProperty('result')) {
        itMsg+='convert ' + actualDisplayName + ' into a new (!== original) value '+util.inspect(test.result, false, null);
      }
      else {
        itMsg+='take ' + actualDisplayName + ' and yield a copy (which !== original)';
      }
    }
    else {
      itMsg+='convert ' + actualDisplayName + ' into '+getDisplayVal(test.result) + ' (a '+getDisplayType(test.result)+')';
    }
    it(itMsg, function (done){
      runTestFn(test, done);
    });
  });
}



function getDisplayVal(v){

  if (_.isDate(v)) {
    return 'a Date';
  }
  if (_.isFunction(v)) {
    return v.toString();
  }
  if (_.isError(v)) {
    return 'an Error';
  }
  if (_.isRegExp(v)) {
    return 'a RegExp';
  }
  if (!_.isPlainObject(v) && !_.isArray(v)) {
    return getDisplayType(v);
  }
  return util.inspect(v,false,null);
}
