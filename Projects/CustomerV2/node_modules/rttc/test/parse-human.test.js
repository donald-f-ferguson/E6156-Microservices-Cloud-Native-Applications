var assert = require('assert');
var rttc = require('../');

describe('.parseHuman()', function() {

  describe('with no type schema', function (){

    it('should understand strings', function() {
      assert.strictEqual(  rttc.parseHuman('foo'), 'foo');
      assert.strictEqual(  rttc.parseHuman(''), '');
      assert.strictEqual(  rttc.parseHuman('stuff'), 'stuff');
    });

    it('should understand numbers', function() {
      assert.strictEqual(  rttc.parseHuman('2'), 2);
      assert.strictEqual(  rttc.parseHuman('-54'), -54);
    });

    it('should treat -0 and +0 as 0', function(){
      assert.strictEqual(  rttc.parseHuman('0'), 0);
      assert.strictEqual(  rttc.parseHuman('-0'), 0);
      assert.strictEqual(  rttc.parseHuman('+0'), 0);
    });

    it('should leave null, NaN, Infinity, and -Infinity as strings', function(){
      assert.strictEqual(  rttc.parseHuman('Infinity'), 'Infinity');
      assert.strictEqual(  rttc.parseHuman('-Infinity'), '-Infinity');
      assert.strictEqual(  rttc.parseHuman('NaN'), 'NaN');
      assert.strictEqual(  rttc.parseHuman('null'), 'null');
    });

    it('should understand booleans', function() {
      assert.strictEqual(  rttc.parseHuman('false'), false);
      assert.strictEqual(  rttc.parseHuman('true'), true);
    });

    it('should leave JSON-encoded dictionaries and arrays as strings', function (){
      assert.strictEqual(  rttc.parseHuman('{}'), '{}');
      assert.strictEqual(  rttc.parseHuman('{"a":2}'), '{"a":2}');
      assert.strictEqual(  rttc.parseHuman('[]'), '[]');
      assert.strictEqual(  rttc.parseHuman('["a"]'), '["a"]');
    });

  });


  describe('with a type schema', function (){

    it('should perform loose validation on things, causing them to be potentially coerced such that they match the type schema', function() {
      assert.strictEqual(  rttc.parseHuman('foo', 'string'), 'foo');
      assert.strictEqual(  rttc.parseHuman('', 'string'), '');
      assert.strictEqual(  rttc.parseHuman('4', 'number'), 4);
      assert.strictEqual(  rttc.parseHuman('-99', 'number'), -99);
      assert.strictEqual(  rttc.parseHuman('false', 'boolean'), false);
      assert.strictEqual(  rttc.parseHuman('true', 'boolean'), true);
      assert.strictEqual(  rttc.parseHuman('-0', 'number'), 0);
      assert.strictEqual(  rttc.parseHuman('0', 'number'), 0);
      assert.strictEqual(  rttc.parseHuman('', 'string'), '');
    });

    it('should perform loose validation on things, throwing an error if they cannot be coerced to match the type schema', function() {
      assert.throws(function (){  rttc.parseHuman('foo', 'number');             });
      assert.throws(function (){  rttc.parseHuman('foo', 'boolean');             });
      assert.throws(function (){  rttc.parseHuman('4', 'boolean');             });
      assert.throws(function (){  rttc.parseHuman('null', 'boolean');             });
      assert.throws(function (){  rttc.parseHuman('null', 'number');             });
      assert.throws(function (){  rttc.parseHuman('Infinity', 'number');             });
      assert.throws(function (){  rttc.parseHuman('-Infinity', 'number');             });
      assert.throws(function (){  rttc.parseHuman('', 'number');             });
      assert.throws(function (){  rttc.parseHuman('', 'boolean');             });
    });

    it('should hydrate functions in `unsafeMode`', function() {
      assert(
        rttc.isEqual(
          rttc.parseHuman('function foo (){}', 'lamda', true),
          function foo (){},
          'lamda'
        )
      );
    });

    it('should leave functions as strings when NOT in `unsafeMode`', function() {
      assert(
        rttc.isEqual(
          rttc.parseHuman('function foo (){}', 'lamda'),
          'function foo (){}',
          'lamda'
        )
      );
    });

  });


  describe('edge-cases', function (){

    it('should refuse to work if provided with a non-string', function() {
      assert.throws(function (){
        rttc.parseHuman(4);
      });
    });

    it('should refuse to work in unsafeMode if no type schema is provided', function() {
      assert.throws(function (){
        rttc.parseHuman('whatever', undefined, true);
      });
    });

  });

});
