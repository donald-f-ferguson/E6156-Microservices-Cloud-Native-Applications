var util = require('util');
var assert = require('assert');
var _ = require('@sailshq/lodash');
var rttc = require('../');

describe('.sample()', function() {


  it('should generate a type that matches', function() {

    // Top-level
    assertAllSampledValuesMatchType('string');
    assertAllSampledValuesMatchType('number');
    assertAllSampledValuesMatchType('boolean');
    assertAllSampledValuesMatchType({});
    assertAllSampledValuesMatchType([]);
    assertAllSampledValuesMatchType('lamda');
    assertAllSampledValuesMatchType('json');
    assertAllSampledValuesMatchType('ref');

    // Facted dictionary
    assertAllSampledValuesMatchType({x:'string'});
    assertAllSampledValuesMatchType({x:'number'});
    assertAllSampledValuesMatchType({x:'boolean'});
    assertAllSampledValuesMatchType({x:{}});
    assertAllSampledValuesMatchType({x:[]});
    assertAllSampledValuesMatchType({x:'lamda'});
    assertAllSampledValuesMatchType({x:'json'});
    assertAllSampledValuesMatchType({x:'ref'});

    // Patterned array
    assertAllSampledValuesMatchType(['string']);
    assertAllSampledValuesMatchType(['number']);
    assertAllSampledValuesMatchType(['boolean']);
    assertAllSampledValuesMatchType([{}]);
    assertAllSampledValuesMatchType([[]]);
    assertAllSampledValuesMatchType(['lamda']);
    assertAllSampledValuesMatchType(['json']);
    assertAllSampledValuesMatchType(['ref']);

    // Patterned array in faceted dictionary
    assertAllSampledValuesMatchType({x:['string']});
    assertAllSampledValuesMatchType({x:['number']});
    assertAllSampledValuesMatchType({x:['boolean']});
    assertAllSampledValuesMatchType({x:[{}]});
    assertAllSampledValuesMatchType({x:[[]]});
    assertAllSampledValuesMatchType({x:['lamda']});
    assertAllSampledValuesMatchType({x:['json']});
    assertAllSampledValuesMatchType({x:['ref']});

    // Faceted dictionary in patterned array
    assertAllSampledValuesMatchType([{x:['string']}]);
    assertAllSampledValuesMatchType([{x:['number']}]);
    assertAllSampledValuesMatchType([{x:['boolean']}]);
    assertAllSampledValuesMatchType([{x:[{}]}]);
    assertAllSampledValuesMatchType([{x:[[]]}]);
    assertAllSampledValuesMatchType([{x:['lamda']}]);
    assertAllSampledValuesMatchType([{x:['json']}]);
    assertAllSampledValuesMatchType([{x:['ref']}]);

  });

});



/**
 * Helper method to check that values samples for a specific type indeed match that type.
 * @param  {[type]} expectedTypeSchema [description]
 * @return {[type]}                    [description]
 */
function assertAllSampledValuesMatchType(expectedTypeSchema){
  var n = 25;
  var samples = rttc.sample(expectedTypeSchema, n);
  _.each(samples, function (sample) {
    assert.doesNotThrow(function (){
      rttc.validateStrict(expectedTypeSchema, sample);
    });
  });
  // Ensure NO MORE THAN `n` (not guaranteed to have exactly `n` samples)
  assert(samples.length <= n);
  // Ensure uniqueness of generated samples
  assert.equal(_.uniq(samples).length, samples.length, 'Expected samples to be unique ('+_.uniq(samples)+') but they weren\'t: '+samples);
}
