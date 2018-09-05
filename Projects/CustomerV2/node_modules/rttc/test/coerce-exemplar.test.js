var util = require('util');
var assert = require('assert');
var _ = require('@sailshq/lodash');
var rttc = require('../');

describe('.coerceExemplar()', function() {

  // From the docs:   (just for reference)
  // =================================================
  //
  // + Empty dictionaries become generic dictionaries (`{}`).  The most specific exemplar which can accept an empty dictionary is the generic dictionary.
  // + Empty arrays become generic arrays (`[]`).  Since we don't know the contents, we have to assume this array could be heterogeneous (i.e. have items with different types).
  // + Multi-item arrays become pattern arrays, and any extra items (other than the first one) are lopped off.
  // + Functions become '->'.
  // + `null` becomes '*'.
  // + If the top-level value is `undefined`, it becomes '==='.
  // + '->' becomes 'an arrow symbol'.
  // + '*' becomes 'a star symbol'.
  // + '===' becomes '3 equal signs'.
  // + `NaN`, `Infinity`, and `-Infinity` become '===' (or 0 if `useStrict` is disabled)
  // + Nested items and keys with `undefined` values are stripped.
  // + Other than the exceptions mentioned above, non-JSON-serializable things (like circular references) are boiled away when this calls `dehydrate` internally.

  it('should replace "json", "ref", and "lamda" exemplars with strings', function (){
    coerceExemplarAndVerifyDeep('*', 'a star symbol');
    coerceExemplarAndVerifyDeep('->', 'an arrow symbol');
    coerceExemplarAndVerifyDeep('<=', 'an arrow symbol');
    coerceExemplarAndVerifyDeep('<---', 'an arrow symbol');
    coerceExemplarAndVerifyDeep('===', '3 equal signs');
  });

  it('should NOT replace "json", "ref", and "lamda" exemplars with strings if the `allowSpecialSyntax` flag is enabled', function (){
    coerceExemplarAndVerifyDeep('*', '*', true);
    coerceExemplarAndVerifyDeep('->', '->', true);
    coerceExemplarAndVerifyDeep('<=', '<=', true);
    coerceExemplarAndVerifyDeep('<---', '<---', true);
    coerceExemplarAndVerifyDeep('===', '===', true);
  });

  it('should leave empty dictionaries, empty arrays, strings, numbers, and booleans alone (and recursively process things)', function (){
    coerceExemplarAndVerifyDeep({}, {});
    coerceExemplarAndVerifyDeep([], []);
    coerceExemplarAndVerifyDeep(true, true);
    coerceExemplarAndVerifyDeep(false, false);
    coerceExemplarAndVerifyDeep(1, 1);
    coerceExemplarAndVerifyDeep(-1.8, -1.8);
    coerceExemplarAndVerifyDeep(0, 0);
  });

  it('should coerce all `null` into "*"', function() {
    coerceExemplarAndVerifyDeep(null, '*');
  });

  it('should coerce circular references (i.e. works just like rttc.dehydrate(), but allowing functions and nulls)', function() {
    var hallOfMirrors = { giveUp: function (){ throw new Error('psht.');} };
    hallOfMirrors.left = { down: null, up: null };
    hallOfMirrors.right = { down: null, up: null };
    hallOfMirrors.left.right = hallOfMirrors.right;
    hallOfMirrors.right.right = hallOfMirrors.right;
    hallOfMirrors.left.right.left = hallOfMirrors.left;

    assert.deepEqual(rttc.coerceExemplar(hallOfMirrors), {
      giveUp: '->',
      left: { down: '*', up: '*', right: {
          down: '*', up: '*', right: '[Circular ~.left.right]', left: '[Circular ~.left]'
        } },
      right: { down: '*', up: '*', right: '[Circular ~.right]', left: {
          down: '*', up: '*', right: '[Circular ~.right]'
        } }
    });
  });

  describe('by default (when `treatTopLvlUndefinedAsRef` is enabled)', function (){
    it('should return "===" if `undefined` is specified at the top-level', function (){
      assert.equal(rttc.coerceExemplar(undefined), '===');
    });
  });

  describe('when `treatTopLvlUndefinedAsRef` is explicitly disabled', function (){
    it('should return "*" if `undefined` is specified at the top-level (because it acts like it was `null`)', function (){
      assert.equal(rttc.coerceExemplar(undefined, false, false), '*');
    });
  });


  it('should squish `NaN`, `Infinity`, and `-Infinity` to `===`', function (){
    coerceExemplarAndVerifyDeep(NaN, '===');
    coerceExemplarAndVerifyDeep(Infinity, '===');
    coerceExemplarAndVerifyDeep(-Infinity, '===');
  });

  it('should coerce Dates, RegExps, and Errors into comparable string exemplars', function (){
    coerceExemplarAndVerifyDeep(new Date('November 5, 1605 GMT'), '1605-11-05T00:00:00.000Z');
    coerceExemplarAndVerifyDeep(/some regexp/, '/some regexp/');

    assert(_.isString(rttc.coerceExemplar(new Error('asdf'))));
    assert(_.isString(
      rttc.coerceExemplar({x: new Error('asdf')}).x
    ));
    assert(_.isString(
      rttc.coerceExemplar([new Error('asdf')])[0]
    ));
  });

  it('should coerce Streams and Buffers into "*" (which is sort of weird, but it\'s ok)', function (){
    coerceExemplarAndVerifyDeep( new Buffer('asdf'), '*'   );
    coerceExemplarAndVerifyDeep( new (require('stream').Readable)(), '*'   );
  });

  it('should coerce functions into "->"', function (){
    coerceExemplarAndVerifyDeep({
      salutation: 'Mr.',
      hobbies: ['knitting'],
      knit: function toKnit(yarn, needle, talent, patience) {
        while (patience) {
          patience -= talent(needle, yarn);
        }
      },
      medicalInfo: {
        numYearsBlueberryAbuse: 12.5,
        latestBloodWork: {}
      }
    }, {
      salutation: 'Mr.',
      hobbies: ['knitting'],
      knit: '->',
      medicalInfo: {
        numYearsBlueberryAbuse: 12.5,
        latestBloodWork: {}
      }
    });
  });

  it('should strip nested keys and items w/ undefined values (but keep `null`)', function() {
    coerceExemplarAndVerifyDeep({numDandelions: 1, numAmaranth: 2, numLambsQuarters: undefined, numThistle: 4}, {numDandelions: 1, numAmaranth: 2, numThistle: 4});
    coerceExemplarAndVerifyDeep({numDandelions: [undefined], numAmaranth: 2, numLambsQuarters: undefined, numThistle: 4}, {numDandelions: [], numAmaranth: 2, numThistle: 4});
    coerceExemplarAndVerifyDeep({numDandelions: [null], numAmaranth: 2, numLambsQuarters: null, numThistle: 4}, {numDandelions: ['*'], numAmaranth: 2, numLambsQuarters: '*', numThistle: 4});
  });


  describe('given a multi-item array', function (){

    it('should union together the items of arrays into a single pattern exemplar', function (){

      coerceExemplarAndVerifyDeep([1], [1]);
      coerceExemplarAndVerifyDeep([1,4], [4]);
      coerceExemplarAndVerifyDeep(['1','4'], ['4']);
      coerceExemplarAndVerifyDeep([1,'1'], ['*']);
      coerceExemplarAndVerifyDeep([0,false], ['*']);
      coerceExemplarAndVerifyDeep([false, 7, 4, true, -4, 0, 89], ['*']);
      coerceExemplarAndVerifyDeep([{x:false}, [7], {y: {z: 4}}, [[]], 'whatever', true], ['*']);

      // TODO: come back to this-- seems like it really ought to be ["*"]
      coerceExemplarAndVerifyDeep([
        [{ x: false }],
        [7],
        [{ y: { z: 4 } }],
        [ [] ],
        ['whatever'],
        [true]
      ], [
        ['===']
      ]);
    });

    it('when `useStrict` flag is explicitly disabled', function (){
      coerceExemplarAndVerifyDeep([1], [1], false, false, false);
      coerceExemplarAndVerifyDeep([1,4], [4], false, false, false);
      coerceExemplarAndVerifyDeep(['1','4'], ['4'], false, false, false);
      coerceExemplarAndVerifyDeep([1,'1'], ['1'], false, false, false);
      coerceExemplarAndVerifyDeep([0,false], [0], false, false, false);
      coerceExemplarAndVerifyDeep([false, 7, 4, true, -4, 0, 89], [89], false, false, false);
      coerceExemplarAndVerifyDeep([false, {}, 4, true, -4, 0, 89], ['*'], false, false, false);
      coerceExemplarAndVerifyDeep([{x:false}, [7], {y: {z: 4}}, [[]], 'whatever', true], ['*'], false, false, false);

      coerceExemplarAndVerifyDeep(NaN, 0, false, false, false);
      coerceExemplarAndVerifyDeep(Infinity, 0, false, false, false);
      coerceExemplarAndVerifyDeep(-Infinity, 0, false, false, false);

      // TODO: come back to this-- seems like it really ought to be ["*"]
      coerceExemplarAndVerifyDeep([
        [{ x: false }],
        [7],
        [{ y: { z: 4 } }],
        [ [] ],
        ['whatever'],
        [true]
      ], [
        ['===']
      ], false, false, false);
    });

  });






});



/**
 * Call `coerceExemplar` using the provided value and test that
 * the expected result comes back, even when wrapping the value in
 * all sorts of dictionaries and arrays and such.
 *
 * @param  {*} value
 * @param  {*} expected
 * @param  {Boolean} allowSpecialSyntax
 * @param  {Boolean} treatTopLvlUndefinedAsRef
 * @param  {Boolean} useStrict
 */
function coerceExemplarAndVerifyDeep(value, expected, allowSpecialSyntax, treatTopLvlUndefinedAsRef, useStrict){
  assert.deepEqual(rttc.coerceExemplar(value, allowSpecialSyntax, treatTopLvlUndefinedAsRef, useStrict), expected);
  assert.deepEqual(rttc.coerceExemplar({x:value}, allowSpecialSyntax, treatTopLvlUndefinedAsRef, useStrict), {x:expected});
  assert.deepEqual(rttc.coerceExemplar({x: [value]}, allowSpecialSyntax, treatTopLvlUndefinedAsRef, useStrict), {x:[expected]});
  assert.deepEqual(rttc.coerceExemplar([{x: value}], allowSpecialSyntax, treatTopLvlUndefinedAsRef, useStrict), [{x:expected}]);
  assert.deepEqual(rttc.coerceExemplar([value], allowSpecialSyntax, treatTopLvlUndefinedAsRef, useStrict), [expected]);
  assert.deepEqual(rttc.coerceExemplar([[value]], allowSpecialSyntax, treatTopLvlUndefinedAsRef, useStrict), [[expected]]);
}

