var util = require('util');
var assert = require('assert');
var _ = require('@sailshq/lodash');
var rttc = require('../');

describe('.getDefaultExemplar()', function() {


  it('should generate correct exemplars', function() {
    CHECK_GENERATES_CORRECT_EXEMPLARS('getDefaultExemplar');
  });


  it('should generate correct exemplars when using `.exemplar()` alias', function() {
    CHECK_GENERATES_CORRECT_EXEMPLARS('exemplar');
  });

});





// Helpers:

function CHECK_GENERATES_CORRECT_EXEMPLARS (methodName) {

    // Top-level
    assert.equal(rttc[methodName]('string'), 'a string');
    assert.equal(rttc[methodName]('number'), 123);
    assert.equal(rttc[methodName]('boolean'), true);
    assert(_.isEqual(rttc[methodName]({}), {}));
    assert(_.isEqual(rttc[methodName]([]), []));
    assert.equal(rttc[methodName]('json'), '*');
    assert.equal(rttc[methodName]('lamda'), '->');
    assert.equal(rttc[methodName]('ref'), '===');

    // Facted dictionary
    assert(_.isEqual(rttc[methodName]({x: 'string'}), {x:'a string'}));
    assert(_.isEqual(rttc[methodName]({x:'number'}), {x:123}));
    assert(_.isEqual(rttc[methodName]({x:'boolean'}), {x:true}));
    assert(_.isEqual(rttc[methodName]({x:{}}), {x:{}}));
    assert(_.isEqual(rttc[methodName]({x:[]}), {x:[]}));
    assert(_.isEqual(rttc[methodName]({x:'json'}), {x:'*'}));
    assert(_.isEqual(rttc[methodName]({x:'lamda'}), {x:'->'}));
    assert(_.isEqual(rttc[methodName]({x:'ref'}), {x:'==='}));

    // Patterned array
    assert(_.isEqual(rttc[methodName](['string']), ['a string']));
    assert(_.isEqual(rttc[methodName](['number']), [123]));
    assert(_.isEqual(rttc[methodName](['boolean']), [true]));
    assert(_.isEqual(rttc[methodName]([{}]), [{}]));
    assert(_.isEqual(rttc[methodName]([[]]), [[]]));
    assert(_.isEqual(rttc[methodName](['json']), ['*']));
    assert(_.isEqual(rttc[methodName](['lamda']), ['->']));
    assert(_.isEqual(rttc[methodName](['ref']), ['===']));

    // Patterned array in faceted dictionary
    assert(_.isEqual(rttc[methodName]({x:['string']}), {x:['a string']}));
    assert(_.isEqual(rttc[methodName]({x:['number']}), {x:[123]}));
    assert(_.isEqual(rttc[methodName]({x:['boolean']}), {x:[true]}));
    assert(_.isEqual(rttc[methodName]({x:[{}]}), {x:[{}]}));
    assert(_.isEqual(rttc[methodName]({x:[[]]}), {x:[[]]}));
    assert(_.isEqual(rttc[methodName]({x:['json']}), {x:['*']}));
    assert(_.isEqual(rttc[methodName]({x:['lamda']}), {x:['->']}));
    assert(_.isEqual(rttc[methodName]({x:['ref']}), {x:['===']}));

    // Faceted dictionary in patterned array
    assert(_.isEqual(rttc[methodName]([{x: 'string'}]), [{x:'a string'}]));
    assert(_.isEqual(rttc[methodName]([{x:'number'}]), [{x:123}]));
    assert(_.isEqual(rttc[methodName]([{x:'boolean'}]), [{x:true}]));
    assert(_.isEqual(rttc[methodName]([{x:{}}]), [{x:{}}]));
    assert(_.isEqual(rttc[methodName]([{x:[]}]), [{x:[]}]));
    assert(_.isEqual(rttc[methodName]([{x:'json'}]), [{x:'*'}]));
    assert(_.isEqual(rttc[methodName]([{x:'lamda'}]), [{x:'->'}]));
    assert(_.isEqual(rttc[methodName]([{x:'ref'}]), [{x:'==='}]));
}
