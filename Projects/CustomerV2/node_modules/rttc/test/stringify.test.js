var util = require('util');
var assert = require('assert');
var _ = require('@sailshq/lodash');
var rttc = require('../');

describe('.stringify()', function() {


  it('should return a string in the general case', function() {
    assert.strictEqual(typeof rttc.stringify('foo'), 'string');
    assert.strictEqual(typeof rttc.stringify(''), 'string');
    assert.strictEqual(typeof rttc.stringify(2323), 'string');
    assert.strictEqual(typeof rttc.stringify(true), 'string');
    assert.strictEqual(typeof rttc.stringify(null), 'string');
    assert.strictEqual(typeof rttc.stringify(Infinity), 'string');
    assert.strictEqual(typeof rttc.stringify(-Infinity), 'string');
    assert.strictEqual(typeof rttc.stringify(NaN), 'string');
    assert.strictEqual(typeof rttc.stringify(new Error('wat')), 'string');
    assert.strictEqual(typeof rttc.stringify(new Buffer('stuff')), 'string');
    assert.strictEqual(typeof rttc.stringify({x:'foo',z: [{a:4}]}), 'string');
  });

  it('should return `"null"` (as a string) when attempting to stringify `undefined` with `allowNull` enabled', function() {
    assert.strictEqual(rttc.stringify(undefined, true), 'null');
  });

  it('should return `undefined` when attempting to stringify `undefined` with `allowNull` disabled (or unspecified)', function() {
    assert(_.isUndefined(rttc.stringify(undefined, false)));
    assert(_.isUndefined(rttc.stringify(undefined)));
  });

});
