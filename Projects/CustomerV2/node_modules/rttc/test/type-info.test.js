var util = require('util');
var assert = require('assert');
var _ = require('@sailshq/lodash');
var rttc = require('../');

describe('.typeInfo()', function() {


  describe('when given a valid type schema', function (){
    it('should always return an object', function() {
      assert.strictEqual(typeof rttc.typeInfo(rttc.infer('foo')), 'object');
      assert.strictEqual(typeof rttc.typeInfo(rttc.infer('')), 'object');
      assert.strictEqual(typeof rttc.typeInfo(rttc.infer(2323)), 'object');
      assert.strictEqual(typeof rttc.typeInfo(rttc.infer(true)), 'object');
      assert.strictEqual(typeof rttc.typeInfo(rttc.infer({x:'foo',z: [{a:4}]})), 'object');
      assert.strictEqual(typeof rttc.typeInfo(rttc.infer([1,2,3])), 'object');
    });


    /**
     * Helper fn that asserts that a specific typeSchema
     * @param  {[type]} typeSchema     [description]
     * @param  {[type]} expectedTypeId [description]
     * @return {[type]}                [description]
     */
    var checkResultingTypeDef = function(typeSchema, expectedTypeId) {
      assert.equal(typeof rttc.typeInfo(typeSchema),'object');
      assert.strictEqual(rttc.typeInfo(typeSchema).id, expectedTypeId);
    };


    it('should recognize facets and patterns', function() {
      checkResultingTypeDef(rttc.infer({a:3}), 'dictionary');
      checkResultingTypeDef(rttc.infer({a:'asdg', b:23, c: true}), 'dictionary');
      checkResultingTypeDef(rttc.infer({a:'asdg', b:23, c: {foo: 'bar'}}), 'dictionary');
      checkResultingTypeDef(rttc.infer([3]), 'array');
      checkResultingTypeDef(rttc.infer([3,4]), 'array');
      checkResultingTypeDef(rttc.infer(['a']), 'array');
      checkResultingTypeDef(rttc.infer(['a','b']), 'array');
      checkResultingTypeDef(rttc.infer([true]), 'array');
      checkResultingTypeDef(rttc.infer([false]), 'array');
      checkResultingTypeDef(rttc.infer([false, false, true, false]), 'array');
      checkResultingTypeDef(rttc.infer([false, null, 'a', -45.3, Infinity]), 'array');
      checkResultingTypeDef(rttc.infer({a:'asdg', b:23, c: [{foo: ['bar']}]}), 'dictionary');
      checkResultingTypeDef(rttc.infer([{a:'asdg', b:23, c: [true]}]), 'array');
      checkResultingTypeDef(rttc.infer(['asdg', {b:23}]), 'array');
      checkResultingTypeDef(rttc.infer([{a:'asdg', b:23, c: [{foo: ['bar']}]}]), 'array');
    });

    it('should recognize schemas with generic dictionaries', function() {
      checkResultingTypeDef(rttc.infer({}), 'dictionary');
      checkResultingTypeDef(rttc.infer({a:3}), 'dictionary');
      checkResultingTypeDef(rttc.infer({a:'asdg'}), 'dictionary');
      checkResultingTypeDef(rttc.infer({a:true}), 'dictionary');
    });

    it('should recognize schemas with generic arrays', function() {
      checkResultingTypeDef(rttc.infer([]), 'array');
      checkResultingTypeDef(rttc.infer([[]]), 'array');
      checkResultingTypeDef(rttc.infer([[[]]]), 'array');
      checkResultingTypeDef(rttc.infer([[[['a', 3, true]]]]), 'array');
      checkResultingTypeDef(rttc.infer([{}]), 'array');
      checkResultingTypeDef(rttc.infer([{a:[]}]), 'array');
      checkResultingTypeDef(rttc.infer([{a:[[[[]]]], b: [[]] }]), 'array');
    });

  });

  describe('when given an invalid type schema', function (){
    it('should throw', function (){

      assert.throws(function (){
        typeof rttc.typeInfo('undefined');
      });
      assert.throws(function (){
        typeof rttc.typeInfo(undefined);
      });


      assert.throws(function (){
        typeof rttc.typeInfo(rttc.infer(null));
      });
      assert.throws(function (){
        typeof rttc.typeInfo(rttc.infer(null));
      });
      assert.throws(function (){
        typeof rttc.typeInfo(rttc.infer(Infinity));
      });
      assert.throws(function (){
        typeof rttc.typeInfo(rttc.infer(-Infinity));
      });
      assert.throws(function (){
        typeof rttc.typeInfo(rttc.infer(NaN));
      });
      assert.throws(function (){
        typeof rttc.typeInfo(rttc.infer(new Error('wat')));
      });
      assert.throws(function (){
        typeof rttc.typeInfo(rttc.infer(new Buffer('stuff')));
      });
      assert.throws(function (){
        typeof rttc.typeInfo(rttc.infer(new Date('stuff')));
      });
      assert.throws(function (){
        typeof rttc.typeInfo(rttc.infer(new Error('stuff')));
      });
      assert.throws(function (){
        typeof rttc.typeInfo(rttc.infer(new RegExp('stuff')));
      });
      assert.throws(function (){
        typeof rttc.typeInfo(rttc.infer(function foo(a,b){}));
      });
    });
  });


  describe('when explicitly given known rttc types', function (){
    it('should recognize "json" and return type definition', function (){
      assert.strictEqual(typeof rttc.typeInfo('json'), 'object');
      assert.strictEqual(rttc.typeInfo('json').id, 'json');
    });
    it('should recognize "ref" and return type definition', function (){
      assert.strictEqual(typeof rttc.typeInfo('ref'), 'object');
      assert.strictEqual(rttc.typeInfo('ref').id, 'ref');
    });
    it('should recognize "lamda" and return type definition', function (){
      assert.strictEqual(typeof rttc.typeInfo('lamda'), 'object');
      assert.strictEqual(rttc.typeInfo('lamda').id, 'lamda');
    });
    it('should recognize "dictionary" and return type definition', function (){
      assert.strictEqual(typeof rttc.typeInfo('dictionary'), 'object');
      assert.strictEqual(rttc.typeInfo('dictionary').id, 'dictionary');
    });
    it('should recognize "array" and return type definition', function (){
      assert.strictEqual(typeof rttc.typeInfo('array'), 'object');
      assert.strictEqual(rttc.typeInfo('array').id, 'array');
    });
    it('should recognize "boolean" and return type definition', function (){
      assert.strictEqual(typeof rttc.typeInfo('boolean'), 'object');
      assert.strictEqual(rttc.typeInfo('boolean').id, 'boolean');
    });
    it('should recognize "number" and return type definition', function (){
      assert.strictEqual(typeof rttc.typeInfo('number'), 'object');
      assert.strictEqual(rttc.typeInfo('number').id, 'number');
    });
    it('should recognize "string" and return type definition', function (){
      assert.strictEqual(typeof rttc.typeInfo('string'), 'object');
      assert.strictEqual(rttc.typeInfo('string').id, 'string');
    });
  });


  describe('when given unknown or invalid types', function (){

    it('should not recognize "blah blah"', function (){
      assert.throws(function (){
        var typeDef = rttc.typeInfo('blah blah');
      });
    });
    it('should not recognize arbitrary things which aren\'t strings', function (){
      assert.throws(function (){
        rttc.typeInfo(/weird stuff/gi);
      });
      assert.throws(function (){
        rttc.typeInfo(new Error('whee'));
      });
    });
  });

  describe('when given an example you\'d normally use for type inference', function (){
    it('should not recognize "*" and throw', function (){
      assert.throws(function (){
        var typeDef = rttc.typeInfo('*');
      });
    });
    it('should not recognize "===" and throw', function (){
      assert.throws(function (){
        var typeDef = rttc.typeInfo('===');
      });
    });
    it('should not recognize "->" and throw', function (){
      assert.throws(function (){
        var typeDef = rttc.typeInfo('->');
      });
    });

  });

});
