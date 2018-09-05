var util = require('util');
var assert = require('assert');
var _ = require('@sailshq/lodash');
var rttc = require('../');

describe('.getDisplayType()', function() {


  it('should always return a string', function() {
    assert.strictEqual(typeof rttc.getDisplayType('foo'), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(''), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(2323), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(true), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(null), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(Infinity), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(-Infinity), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(NaN), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(new Error('wat')), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(new Buffer('stuff')), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(new Date('stuff')), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(new Error('stuff')), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(new RegExp('stuff')), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(function foo(a,b){}), 'string');
    assert.strictEqual(typeof rttc.getDisplayType({x:'foo',z: [{a:4}]}), 'string');
    assert.strictEqual(typeof rttc.getDisplayType([1,2,3]), 'string');
    assert.strictEqual(typeof rttc.getDisplayType(undefined), 'string');
  });


  it('should recognize special rttc exemplar syntax', function (){
    assert.strictEqual(rttc.getDisplayType('*'), 'json');
    assert.strictEqual(rttc.getDisplayType('==='), 'ref');
    assert.strictEqual(rttc.getDisplayType('->'), 'lamda');
    assert.strictEqual(rttc.getDisplayType('<-'), 'lamda');
  });

  it('should recognize strings', function (){
    assert.strictEqual(rttc.getDisplayType(''), 'string');
    assert.strictEqual(rttc.getDisplayType('stuff'), 'string');
  });
  it('should recognize invalid numbers', function (){
    assert.strictEqual(rttc.getDisplayType(Infinity), 'invalid number');
    assert.strictEqual(rttc.getDisplayType(-Infinity), 'invalid number');
    assert.strictEqual(rttc.getDisplayType(NaN), 'invalid number');
  });
  it('should recognize valid numbers', function (){
    assert.strictEqual(rttc.getDisplayType(3.239), 'number');
    assert.strictEqual(rttc.getDisplayType(-235235.3), 'number');
    assert.strictEqual(rttc.getDisplayType(2353), 'number');
    assert.strictEqual(rttc.getDisplayType(0), 'number');
    assert.strictEqual(rttc.getDisplayType(+0), 'number');
    assert.strictEqual(rttc.getDisplayType(-0), 'number');
  });
  it('should recognize booleans', function (){
    assert.strictEqual(rttc.getDisplayType(false), 'boolean');
    assert.strictEqual(rttc.getDisplayType(true), 'boolean');
  });
  it('should recognize null', function (){
    assert.strictEqual(rttc.getDisplayType(null), 'null');
  });
  it('should recognize undefined', function (){
    assert.strictEqual(rttc.getDisplayType(undefined), 'undefined');
  });
  it('should recognize Dates', function (){
    assert.strictEqual(rttc.getDisplayType(new Date()), 'Date');
  });
  it('should recognize RegExps', function (){
    assert.strictEqual(rttc.getDisplayType(new RegExp('stuff')), 'RegExp');
    assert.strictEqual(rttc.getDisplayType(/foo/ig), 'RegExp');
  });
  it('should recognize Errors', function (){
    assert.strictEqual(rttc.getDisplayType(new Error()), 'Error');
  });
  it('should recognize functions (including constructors and functions w/ properties)', function (){
    assert.strictEqual(rttc.getDisplayType(function (){}), 'function');
    assert.strictEqual(rttc.getDisplayType(function someFn(x,y){return x+y;}), 'function');
    assert.strictEqual(rttc.getDisplayType(new Function('return "stuff";')), 'function');
    assert.strictEqual(rttc.getDisplayType(Error), 'function');
    assert.strictEqual(rttc.getDisplayType(Date), 'function');
    assert.strictEqual(rttc.getDisplayType(RegExp), 'function');
    assert.strictEqual(rttc.getDisplayType(Array), 'function');
    assert.strictEqual(rttc.getDisplayType(Object), 'function');
    assert.strictEqual(rttc.getDisplayType((function(){
      var someFnWithExcitingSecrets = function (){};
      someFnWithExcitingSecrets.foo = 'bar';
      someFnWithExcitingSecrets.bar = someFnWithExcitingSecrets.foo;
      someFnWithExcitingSecrets.baz = {bar: someFnWithExcitingSecrets.bar};
      return someFnWithExcitingSecrets;
    })()), 'function');
  });
  it('should recognize arrays', function (){
    assert.strictEqual(rttc.getDisplayType([]), 'array');
    assert.strictEqual(rttc.getDisplayType(new Array()), 'array');
  });
  it('should recognize dictionaries', function (){
    assert.strictEqual(rttc.getDisplayType({}), 'dictionary');
    assert.strictEqual(rttc.getDisplayType({a:[]}), 'dictionary');
    assert.strictEqual(rttc.getDisplayType({a:{x:3}}), 'dictionary');
    assert.strictEqual(rttc.getDisplayType(new Object()), 'dictionary');
  });
  it('should recognize Streams', function (){
    assert.strictEqual(rttc.getDisplayType(new (require('stream').Readable)()), 'Readable');
    assert.strictEqual(rttc.getDisplayType(new (require('stream').Stream)()), 'Stream');
    assert.strictEqual(rttc.getDisplayType(new (require('stream').Writable)()), 'Writable');
  });
  it('should recognize Buffers', function (){
    assert.strictEqual(rttc.getDisplayType(new Buffer('asdf')), 'Buffer');
  });

});
