/**
 * Module dependencies
 */

var TEST_SUITE = require('../spec/validation.spec');
var runSuite = require('../spec/helpers/run-suite');
var toRunTestWith = require('./helpers/to-run-test-with');
var expandSuite = require('../spec/helpers/expand-suite');
var rttc = require('../');


describe('.validate()', function (){

  // Take the array of tests and extend them with some derivative
  // tests automatically.  Then run them.
  runSuite(expandSuite(TEST_SUITE), toRunTestWith(rttc.validate));

});

