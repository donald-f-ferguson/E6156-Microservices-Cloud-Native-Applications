/**
 * Module dependencies
 */

var util = require('util');
var assert = require('assert');
var _ = require('@sailshq/lodash');
var rttc = require('../');



describe('.intersection()', function() {


  //  ┌─┐┬─┐ ┬┌┬┐┬ ┬┬─┐┌─┐┌─┐
  //  ├┤ │┌┴┬┘ │ │ │├┬┘├┤ └─┐
  //  └  ┴┴ └─ ┴ └─┘┴└─└─┘└─┘
  // Fixtures
  var LYDIA = {
    id: 102432,
    name: 'Lydia Villa-Komaroff',
    age: 68,
    meta: '===',
    coordinates: { x: 10, y: -4 },
    friends: [
      {
        id: 93825,
        name: 'José Orozco',
        age: 65,
        meta: '===',
        coordinates: { x: -391, y: 47.3295 }
      }
    ]
  };


  // Shortcut used below for convenience:
  var given = function (exemplar0, exemplar1){
    return {
      expect: function (expectedResult){
        // Perform the standard, usual call to `rttc.intersection()`
        // (using exemplars rather than type schemas and with `strict` set to `false`)
        var actualResult = rttc.intersection(exemplar0, exemplar1, true, false);
        assert.deepEqual(expectedResult, actualResult);
      }
    };
  };



  //  ┌┬┐┌─┐┌─┐┌┬┐┌─┐
  //   │ ├┤ └─┐ │ └─┐
  //   ┴ └─┘└─┘ ┴ └─┘
  describe('using exemplars & loose validation rules', function() {


    // Types always intersect with themselves, with an identity result.
    describe('when intersected with the same type', function (){
      describe('should result in an exemplar with the same type schema', function (){


        // "string"  ∩  "string"          <====> "string"
        it('"string"  ∩  "string"', function (){
          given('foo', 'bar').expect('bar');
          given('bar', 'foo').expect('foo');
        });

        // "number"  ∩  "number"          <====> "number"
        it('"number"  ∩  "number"', function (){
          given(-9, 32).expect(32);
          given(32, -9).expect(-9);
        });

        // "boolean"  ∩  "boolean"        <====> "boolean"
        it('"boolean"  ∩  "boolean"', function (){
          given(true, true).expect(true);
          given(false, false).expect(false);
          given(false, true).expect(true);
          given(true, false).expect(false);
        });

        // "lamda"  ∩  "lamda"            <====> "lamda"
        it('"lamda"  ∩  "lamda"', function (){
          given('->', '->').expect('->');
        });

        // Generic dictionary exemplars
        it('Generic dictionary exemplars', function (){
          given({}, {}).expect({});
        });

        // "json"  ∩  "json"              <====> "json"
        it('"json"  ∩  "json"', function (){
          given('*', '*').expect('*');
        });

        // "ref"  ∩  "ref"                <====> "ref"
        it('"ref"  ∩  "ref"', function (){
          given('===', '===').expect('===');
        });

        // "Generic array" exemplars  (for compatibility)
        //   []   ∩   []
        //      -AKA-                     <====> ["*"]
        // ["*"]  ∩  ["*"]
        it('"Generic array" exemplars  (for compatibility)', function (){
          given([], []).expect([]);
          given([], ['*']).expect(['*']);
          given(['*'], []).expect(['*']);
          given(['*'], ['*']).expect(['*']);
        });

        // Array exemplars  (i.e. patterned arrays)
        // [...]  ∩  [...]                <====> [...]
        it('Array exemplars  (i.e. patterned arrays, `[...]`)', function (){
          given(['==='], ['===']).expect(['===']);
        });

        // Faceted dictionary exemplars
        // {...}  ∩  {...}                <====> {...}
        it('Faceted dictionary exemplars (`{...}`)', function (){
          given(LYDIA, LYDIA).expect(LYDIA);
        });

      });//</should result in an exemplar with the same type schema>
    });//</when intersected with the same type>





    // Every type intersects with "ref", with an identity result.
    describe('when intersected with "ref"', function (){

      // Simple helper used below for convenience/conciseness.
      var testVsRef = function (exemplar){
        given(exemplar, '===').expect(exemplar);
        given('===', exemplar).expect(exemplar);
      };

      describe('every type should result in an identity result', function (){

        it('"string"     ∩  "ref"           <====> "string"', function (){
          testVsRef('foo');
        });

        it('"number"     ∩  "ref"           <====> "number"', function (){
          testVsRef(-9);
          testVsRef(32);
        });

        it('"boolean"    ∩  "ref"           <====> "boolean"', function (){
          testVsRef(true);
          testVsRef(false);
        });

        it('"lamda"      ∩  "ref"           <====> "lamda"', function (){
          testVsRef('->');
        });

        it('"json"       ∩  "ref"           <====> "json"', function (){
          testVsRef('*');
        });

        it('{}           ∩  "ref"           <====> {}', function (){
          testVsRef({});
        });

        // "Generic array" exemplars  (for compatibility)
        it('  []   ∩   "ref"                <====> []', function (){
          testVsRef([]);
        });

        it('{...}   ∩   "ref"               <====> {...}', function (){
          testVsRef(LYDIA);
        });

        it('[...]   ∩   "ref"               <====> [...]', function (){
          testVsRef([LYDIA]);
          testVsRef(LYDIA.friends);
        });

      });//</every type should result in an identity result>
    });//</when intersected with "ref">




    // Now run the suite of tests in the specification directory (`spec/`).
    var TEST_SUITE = require('../spec/intersection.spec');
    _.each(TEST_SUITE, function (testDef){
      it('`'+util.inspect(testDef.e0, {depth: null})+'`    ∩   `'+util.inspect(testDef.e1, {depth: null})+'`', function (){
        given(testDef.e0, testDef.e1).expect(testDef.result);
      });
    });


    // Additional notes:

    // Every type except "ref" and "lamda" intersects with "json", with an identity result.
    // "string"     ∩  "json"          <====> "string"
    // "number"     ∩  "json"          <====> "number"
    // "boolean"    ∩  "json"          <====> "boolean"
    // {}           ∩  "json"          <====> {}
    // []           ∩  "json"          <====> []
    // {x:"string"} ∩  "json"          <====> {x:"string"}
    // ["string"]   ∩  "json"          <====> ["string"]

    // Strings, numbers, booleans, and lamdas do not intersect with each other,
    // or with any sort of dictionary or array type.
    // "string"  ∩  (anything else)    <==/==> (ERROR)
    // "number"  ∩  (anything else)    <==/==> (ERROR)
    // "boolean" ∩  (anything else)    <==/==> (ERROR)
    // "lamda"   ∩  (anything else)    <==/==> (ERROR)

    // Faceted dictionaries intersect with generic dictionaries, with an identity result.
    // {a:"string"} ∩ {}               <====> {a:"string"}
    // {a:{}} ∩ {}                     <====> {a:{}}

    // Patterned arrays intersect with generic arrays, with an identity result.
    // ["string"]  ∩  []               <====> ["string"]
    // [[{}]]  ∩  []                   <====> [[{}]]
    // [{}]  ∩  ["string"]             <====> ["string"]

    // Faceted dictionaries intersect with other faceted dictionaries as long as recursive
    // types also successfully intersect. The result is the merged schema.
    // (extra keys are ok, since they'll just be ignored)
    // {a:"string"} ∩ {a:"string",b:"string"}         <====> {a:"string", b: "string"}
    // {x:"string"} ∩ {a:"string",b:"string"}         <====> {a:"string", b: "string", x: "string"}
    // {x:"string", a:"number"} ∩ {a:"string",b:"string"} <==/=> (ERROR)
    // {x:"string", a:"json"}   ∩ {a:"string",b:"string"} <====> {a:"string", b: "string", x: "string"}

    // Patterned arrays intersect with other patterned arrays as long as the recursive
    // types also successfully intersect.  The result is the merged schema.
    // ["number"] ∩ ["json"]           <====> ["number"]
    // ["number"] ∩ ["string"]         <==/=> (ERROR)
    // [{a:"number"}] ∩ [{}]           <====> [{a:"number"}]

    // Exceptions when NOT using strict validation:
    // "number"    ∩  "string"        <====> "number"
    // "boolean"   ∩  "string"        <====> "boolean"
    // "number"    ∩  "boolean"       <====> "boolean"


    // // Special cases:
    // describe('special cases', function (){
    //   it('inside a generic dictionary keypath: should act like `json`', function (){
    //     assert.deepEqual({ x: 'foo' }, intersection({ x: 'foo' }, {}));
    //     assert.deepEqual({ x: 'foo' }, intersection({}, { x: 'foo' }));
    //   });
    //   it('inside a generic array keypath: should act like `json`', function (){
    //     assert.deepEqual({ x: 'foo' }, intersection({ x: 'foo' }, []));
    //     assert.deepEqual({ x: 'foo' }, intersection({ x: 'foo' }, ['*']));
    //     assert.deepEqual({ x: 'foo' }, intersection([], { x: 'foo' }));
    //     assert.deepEqual({ x: 'foo' }, intersection(['*'], { x: 'foo' }));
    //   });
    //   it('inside a JSON keypath: should act like `json`', function (){
    //     assert.deepEqual({ x: 'foo' }, intersection({ x: 'foo' }, '*'));
    //     assert.deepEqual({ x: 'foo' }, intersection('*', { x: 'foo' }));
    //   });
    //   it('inside a ref keypath: should act like `ref`', function (){
    //     assert.deepEqual({ x: 'foo' }, intersection({ x: 'foo' }, '==='));
    //     assert.deepEqual({ x: 'foo' }, intersection('===', { x: 'foo' }));
    //   });
    //   it('inside any other keypath: should throw an error', function (){
    //     // TODO: come back to this
    //   });
    // });//</special cases>


  });//</using exemplars & loose validation rules>

});//</.intersection()>
