/**
 * Module dependencies
 */

var util = require('util');
var _ = require('@sailshq/lodash');
var infer = require('../../lib/infer');
var getDisplayType = require('../../lib/get-display-type');
var isEqual = require('../../lib/is-equal');
var getAbbreviatedDisplayVal = require('../../lib/helpers/get-abbreviated-display-val');



module.exports = function toRunTestWith(transformationFn) {
  return function _runTest(expectations, cb){

    // Determine type schema of the value.
    // (using inference to pull it from the `example`, if provided)
    var typeSchema;
    if (!_.isUndefined(expectations.type)) {
      typeSchema = expectations.type;
    }
    else {
      typeSchema = infer(expectations.example);
    }

    // Create backup copies of our type schema and example
    // (we validate whether they were inadvertently changed below)
    var originalExampleBackup = _.cloneDeep(expectations.example);
    var originalTypeSchemaBackup = _.cloneDeep(typeSchema);


    // Now validate and/or coerce the actual value against the type schema.
    var actualResult;
    var gotError;
    try {
      actualResult = transformationFn(typeSchema, expectations.actual);
    }
    catch (e) {
      gotError = e;
    }


    // Finally, make sure the right thing happened and that we
    // got the appropriate result.
    //
    //
    // Ensure that if we got an error, we were expecting it.
    if (gotError){
      if (expectations.error) {return cb();}
      return cb(new Error('did not expect error, but got one:\n' + util.inspect(gotError) + '\n\nHere is the stack from the error:\n'+gotError.stack+'\n' ));
    }
    // Handle case where we were expecting an error, but we didn't get one.
    if (expectations.error) {
      return cb(new Error('expected a error, but did not get one. Instead, returned '+util.inspect(actualResult, false, null)+'.'));
    }


    // If an expected `result` is provided, compare the actual result against that.
    // Otherwise compare it against the original value (`actual`)
    var compareTo = expectations.hasOwnProperty('result') ? expectations.result : expectations.actual;

    if (!isEqual(actualResult, compareTo, typeSchema)) {
      return cb(new Error('returned incorrect value: '+getAbbreviatedDisplayVal(actualResult)+' (a '+getDisplayType(actualResult)+')'));
    }

    // Test using strict equality (===) if explicitly requested
    if (expectations.strictEq) {
      if (actualResult !== compareTo) {
        return cb(new Error('returned value is equivalent (but not ===)'));
      }
    }

    // Test AGAINST strict equality using `isNew` if requested
    // (i.e. guarantees this is a new value and is !== what was passed in)
    if (expectations.isNew) {

      // Check both the expected result and the actual value, just to be safe.
      // (should never even be possible for it to be a direct reference to the expected result)
      if (actualResult === compareTo || actualResult === expectations.actual) {
        return cb(new Error('returned value === value that was passed in -- but should have been a new value!'));
      }
    }

    // Test that the `example` originally passed in, as well as the
    // inferred `typeSchema`, have not been altered.
    //
    // (The `typeSchema` should NEVER change as a result of running this test.
    //  And neither should `expectations.example`, if it was provided.)
    if (!isEqual(typeSchema, originalTypeSchemaBackup)) {
      return cb(new Error('inferred type schema was modified as a result of running test!! it became: '+util.inspect(typeSchema, {depth: null})+' (a '+getDisplayType(typeSchema)+')'));
    }
    if (!_.isUndefined(originalExampleBackup)) {
      if (!isEqual(expectations.example, originalExampleBackup)) {
        return cb(new Error('`example` was modified as a result of running test!! it became: '+util.inspect(expectations.example, {depth: null})+' (a '+getDisplayType(expectations.example)+')'));
      }
    }

    // If we made it here, everything's good!
    return cb();

  };
};

