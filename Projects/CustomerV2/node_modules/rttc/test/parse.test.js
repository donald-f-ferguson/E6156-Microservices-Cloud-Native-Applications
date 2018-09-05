var util = require('util');
var assert = require('assert');
var _  = require('@sailshq/lodash');
var rttc = require('../');

describe('.parse()', function() {


  it('should accurately recreate encoded strings', function() {
    checkSerialization('stuff');
  });

  it('should accurately recreate encoded numbers', function (){
    checkSerialization(8232);
  });

  it('should accurately recreate encoded booleans', function (){
    checkSerialization(false);
  });

  it('should accurately recreate encoded dictionaries', function (){
    checkSerialization({});
    checkSerialization({foo:'bar'});
    checkSerialization({foo:{bar:'baz'}});
    checkSerialization({foo:{bar:['baz']}});
    checkSerialization({foo:[{bar:['baz']}]});
  });

  it('should accurately recreate encoded arrays', function (){
    checkSerialization([]);
    checkSerialization(['Arya Stark', 'Jon Snow']);
    checkSerialization([2932,138,11,424]);
    checkSerialization([true, true, false]);
    checkSerialization([true, true, false, false]);
    checkSerialization([{species: 'Hopidor maxim', weight: 23821394, isAvailable: true}]);
    checkSerialization([['baz']]);
    checkSerialization([{foo:[{bar:['baz']}]}, {foo:[{bar:['brains']}]}], [{foo: [{bar: ['string']}]}], true);
    checkSerialization([{foo:[{bar:[function things(){}]}]}, {foo:[{bar:[function stuff(){}]}]}], [{foo: [{bar: ['lamda']}]}], true);
  });

  it('should throw when given a non-string', function (){
    assert.throws(function (){ rttc.parse(null); });
    assert.throws(function (){ rttc.parse(undefined); });
    assert.throws(function (){ rttc.parse(29); });
    assert.throws(function (){ rttc.parse(true); });
    assert.throws(function (){ rttc.parse(false); });
    assert.throws(function (){ rttc.parse({}); });
    assert.throws(function (){ rttc.parse([]); });
    assert.throws(function (){ rttc.parse(['a']); });
  });

  it('should throw given empty string (because it cannot be parsed as JSON)', function (){
    assert.throws(function (){ rttc.parse(''); });
  });


  it('should accurately recreate encoded functions if a "lamda" `typeSchema` was provided and `unsafeMode` was enabled', function (){
    var original = function someFn(x,y,z){ return x + y - z + x + Math.pow(y,z); };
    var encoded = rttc.stringify(original);
    var decoded = rttc.parse(encoded, 'lamda', true);
    assert(_.isFunction(decoded));

    assert.strictEqual(original(4,5,6), decoded(4,5,6));
  });

  it('should NOT accurately recreate encoded functions in the general case', function (){
    var original = function someFn(x,y,z){ return x + y - z + x + Math.pow(y,z); };
    var decoded = rttc.parse(rttc.stringify(original));

    assert(!_.isFunction(decoded));
    assert(_.isString(decoded));
    assert.strictEqual(decoded, original.toString());
  });

  it('should decode an Error to a string, and that string should be the `.stack` property of the original instance', function (){
    var original = new Error('some error');
    var decoded = rttc.parse(rttc.stringify(original));

    assert(!_.isError(decoded));
    assert(_.isString(decoded));
    assert.strictEqual(decoded, original.stack);
  });

  it('should decode a Date as an ISO 1608 timestamp', function (){
    var original = new Date('August 11, 1988');
    var decoded = rttc.parse(rttc.stringify(original));

    assert(!_.isDate(decoded));
    assert(_.isString(decoded));
    assert.strictEqual(decoded, original.toJSON());
  });

  it('should decode a RegExp as a .toString() version of the original', function (){
    var original = /some regexp/gi;
    var decoded = rttc.parse(rttc.stringify(original));

    assert(!_.isRegExp(decoded));
    assert(_.isString(decoded));
    assert.strictEqual(decoded, original.toString());
  });


  it('should properly decode the characters from "I Love Lucy"', function (){
    var encoded = '[{"name":"Lucy"},{"name":"Ricky"},{"name":"Louise"},{"name":"Ethyl"}]';
    var example = [{}];
    var decoded = rttc.parse(encoded, rttc.infer(example), true);
    assert.deepEqual([{name: 'Lucy'}, {name:'Ricky'},{name:'Louise'},{name:'Ethyl'}], decoded);
  });


});


/**
 * helper asserting that encoding and then decoding the original value results in an equivalent value.
 * @param  {[type]} original [description]
 * @return {[type]}          [description]
 */
function checkSerialization(original) {
  var encoded = rttc.stringify(original);
  var decoded = rttc.parse(encoded);
  assert.deepEqual(decoded, original);
}
