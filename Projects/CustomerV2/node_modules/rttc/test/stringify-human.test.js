var util = require('util');
var assert = require('assert');
var _ = require('@sailshq/lodash');
var rttc = require('../');

describe('.stringifyHuman()', function() {

  it('should coerce things to match the type schema, but as strings', function() {

    assert.strictEqual(  rttc.stringifyHuman('foo', 'string'), 'foo');
    assert.strictEqual(  rttc.stringifyHuman('', 'string'), '');
    assert.strictEqual(  rttc.stringifyHuman('4', 'string'), '4');
    assert.strictEqual(  rttc.stringifyHuman('-99', 'string'), '-99');
    assert.strictEqual(  rttc.stringifyHuman('Infinity', 'string'), 'Infinity');
    assert.strictEqual(  rttc.stringifyHuman('-Infinity', 'string'), '-Infinity');
    assert.strictEqual(  rttc.stringifyHuman('NaN', 'string'), 'NaN');
    assert.strictEqual(  rttc.stringifyHuman('true', 'string'), 'true');
    assert.strictEqual(  rttc.stringifyHuman('false', 'string'), 'false');
    assert.strictEqual(  rttc.stringifyHuman('foo', 'json'), '"foo"');
    assert.strictEqual(  rttc.stringifyHuman('', 'json'), '""');
    assert.strictEqual(  rttc.stringifyHuman('4', 'json'), '"4"');
    assert.strictEqual(  rttc.stringifyHuman('-99', 'json'), '"-99"');
    assert.strictEqual(  rttc.stringifyHuman('true', 'json'), '"true"');
    assert.strictEqual(  rttc.stringifyHuman('false', 'json'), '"false"');
    assert.strictEqual(  rttc.stringifyHuman('null', 'json'), '"null"');
    assert.strictEqual(  rttc.stringifyHuman('foo', 'ref'), '"foo"');
    assert.strictEqual(  rttc.stringifyHuman('', 'ref'), '""');
    assert.strictEqual(  rttc.stringifyHuman('4', 'ref'), '"4"');
    assert.strictEqual(  rttc.stringifyHuman('-99', 'ref'), '"-99"');
    assert.strictEqual(  rttc.stringifyHuman('true', 'ref'), '"true"');
    assert.strictEqual(  rttc.stringifyHuman('false', 'ref'), '"false"');
    assert.strictEqual(  rttc.stringifyHuman('null', 'ref'), '"null"');

    assert.strictEqual(  rttc.stringifyHuman(4, 'number'), '4');
    assert.strictEqual(  rttc.stringifyHuman(10.345, 'number'), '10.345');
    assert.strictEqual(  rttc.stringifyHuman(-99, 'number'), '-99');
    assert.strictEqual(  rttc.stringifyHuman(Math.PI, 'number'), '3.141592653589793');
    assert.strictEqual(  rttc.stringifyHuman(4, 'json'), '4');
    assert.strictEqual(  rttc.stringifyHuman(10.345, 'json'), '10.345');
    assert.strictEqual(  rttc.stringifyHuman(-99, 'json'), '-99');
    assert.strictEqual(  rttc.stringifyHuman(Math.PI, 'json'), '3.141592653589793');
    assert.strictEqual(  rttc.stringifyHuman(4, 'ref'), '4');
    assert.strictEqual(  rttc.stringifyHuman(10.345, 'ref'), '10.345');
    assert.strictEqual(  rttc.stringifyHuman(-99, 'ref'), '-99');
    assert.strictEqual(  rttc.stringifyHuman(Math.PI, 'ref'), '3.141592653589793');

    assert.strictEqual(  rttc.stringifyHuman(false, 'boolean'), 'false');
    assert.strictEqual(  rttc.stringifyHuman(true, 'boolean'), 'true');
    assert.strictEqual(  rttc.stringifyHuman(true, 'json'), 'true');
    assert.strictEqual(  rttc.stringifyHuman(false, 'json'), 'false');
    assert.strictEqual(  rttc.stringifyHuman(true, 'ref'), 'true');
    assert.strictEqual(  rttc.stringifyHuman(false, 'ref'), 'false');

    assert.strictEqual(  rttc.stringifyHuman({}, {}),     '{}');
    assert.strictEqual(  rttc.stringifyHuman({}, 'json'), '{}');
    assert.strictEqual(  rttc.stringifyHuman({}, 'ref'),  '{}');

    assert.strictEqual(  rttc.stringifyHuman([], []),     '[]');
    assert.strictEqual(  rttc.stringifyHuman([], 'json'), '[]');
    assert.strictEqual(  rttc.stringifyHuman([], 'ref'),  '[]');

    assert.strictEqual(  rttc.stringifyHuman(function asdf(){}, 'lamda'), 'function asdf(){}');

    assert.strictEqual(  rttc.stringifyHuman(null, 'json'), 'null');
    assert.strictEqual(  rttc.stringifyHuman(null, 'ref'), 'null');
  });


  it('should be reversible using .parseHuman()', function() {
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('foo', 'string'), 'string', true),       'foo',  'string'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('', 'string'), 'string', true),       '',  'string'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('4', 'string'), 'string', true),       '4',  'string'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('-99', 'string'), 'string', true),       '-99',  'string'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('Infinity', 'string'), 'string', true),       'Infinity',  'string'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('-Infinity', 'string'), 'string', true),       '-Infinity',  'string'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('NaN', 'string'), 'string', true),       'NaN',  'string'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('true', 'string'), 'string', true),       'true',  'string'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('false', 'string'), 'string', true),       'false',  'string'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('foo', 'json'), 'json', true),       'foo',  'json'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('', 'json'), 'json', true),       '',  'json'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('4', 'json'), 'json', true),       '4',  'json'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('-99', 'json'), 'json', true),       '-99',  'json'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('true', 'json'), 'json', true),       'true',  'json'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('false', 'json'), 'json', true),       'false',  'json'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('null', 'json'), 'json', true),       'null',  'json'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('foo', 'ref'), 'ref', true),       'foo',  'ref'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('', 'ref'), 'ref', true),       '',  'ref'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('4', 'ref'), 'ref', true),       '4',  'ref'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('-99', 'ref'), 'ref', true),       '-99',  'ref'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('true', 'ref'), 'ref', true),       'true',  'ref'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('false', 'ref'), 'ref', true),       'false',  'ref'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman('null', 'ref'), 'ref', true),       'null',  'ref'                 )      );

    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(4, 'number'), 'number', true),       4,  'number'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(10.345, 'number'), 'number', true),       10.345,  'number'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(-99, 'number'), 'number', true),       -99,  'number'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(Math.PI, 'number'), 'number', true),       Math.PI,  'number'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(4, 'json'), 'json', true),       4,  'json'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(10.345, 'json'), 'json', true),       10.345,  'json'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(-99, 'json'), 'json', true),       -99,  'json'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(Math.PI, 'json'), 'json', true),       Math.PI,  'json'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(4, 'ref'), 'ref', true),       4,  'ref'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(10.345, 'ref'), 'ref', true),       10.345,  'ref'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(-99, 'ref'), 'ref', true),       -99,  'ref'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(Math.PI, 'ref'), 'ref', true),       Math.PI,  'ref'                 )      );

    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(false, 'boolean'), 'boolean', true),       false,  'boolean'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(true, 'boolean'), 'boolean', true),       true,  'boolean'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(true, 'json'), 'json', true),       true,  'json'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(false, 'json'), 'json', true),       false,  'json'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(true, 'ref'), 'ref', true),       true,  'ref'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(false, 'ref'), 'ref', true),       false,  'ref'                 )      );

    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman({}, {}),  {}, true),       {},  {}                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman({}, 'json'), 'json', true),       {},  'json'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman({}, 'ref'), 'ref', true),       {},  'ref'                 )      );

    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman([], []),  [], true),       [],  []                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman([], 'json'), 'json', true),       [],  'json'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman([], 'ref'), 'ref', true),       [],  'ref'                 )      );

    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(function asdf(){}, 'lamda'), 'lamda', true),       function asdf(){},  'lamda'                 )      );

    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(null, 'json'), 'json', true),       null,  'json'                 )      );
    assert(      rttc.isEqual(  rttc.parseHuman(rttc.stringifyHuman(null, 'ref'), 'ref', true),       null,  'ref'                 )      );
  });


  it('should add quotes to strings when type schema is "json"', function() {
    assert.strictEqual(rttc.stringifyHuman('stuff', 'json'), '"stuff"' );
  });

  it('should add NOT quotes to numbers, booleans, dictionaries, arrays, or `null` when type schema is "json"', function() {
    assert.strictEqual(rttc.stringifyHuman(3, 'json'), '3' );
    assert.strictEqual(rttc.stringifyHuman(true, 'json'), 'true' );
    assert.strictEqual(rttc.stringifyHuman({}, 'json'), '{}' );
    assert.strictEqual(rttc.stringifyHuman([], 'json'), '[]' );
    assert.strictEqual(rttc.stringifyHuman(null, 'json'), 'null' );
  });
  it('should tolerate `null` for "json" type schemas', function() {
    assert.strictEqual( rttc.stringifyHuman(null, 'json'), 'null');
  });
  it('should tolerate `null` for "ref" type schemas', function() {
    assert.strictEqual( rttc.stringifyHuman(null, 'ref'), 'null' );
  });
  it('should tolerate `null` for type schemas w/ nested "json" types', function() {
    assert.strictEqual( rttc.stringifyHuman([null], ['json']), '[null]' );
    assert.strictEqual( rttc.stringifyHuman({x:null}, {x:'json'}), '{"x":null}' );
  });
  it('should tolerate `null` for type schemas w/ nested "ref" types', function() {
    assert.strictEqual( rttc.stringifyHuman([null], ['ref']), '[null]');
    assert.strictEqual( rttc.stringifyHuman({x:null}, {x:'ref'}), '{"x":null}' );
  });
  it('should NOT tolerate `null` for {} or [] type schemas', function() {
    assert.throws(function (){
      rttc.stringifyHuman(null, {});
    });
    assert.throws(function (){
      rttc.stringifyHuman(null, []);
    });
    assert.throws(function (){
      rttc.stringifyHuman([null], [{}]);
    });
    assert.throws(function (){
      rttc.stringifyHuman([null], [[]]);
    });
    assert.throws(function (){
      rttc.stringifyHuman({x:null}, {x:{}});
    });
    assert.throws(function (){
      rttc.stringifyHuman({x:null}, {x:[]});
    });
  });

  it('should dehydrate functions (if we have a lamda type schema)', function() {
    assert(
      rttc.isEqual(rttc.stringifyHuman(function foo (){}, 'lamda'), 'function foo(){}', 'lamda')
    );
  });


  it('should dehydrate nested functions (if we have a type schema w/ nested lamdas in the appropriate places)', function() {
    assert.equal(
      rttc.stringifyHuman({x:function foo (){}}, {x:'lamda'}),
      '{"x":"function foo(){}"}'
    );
    assert.equal(
      rttc.stringifyHuman({x:{y:function foo (){}}}, {x:{y:'lamda'}}),
      '{"x":{"y":"function foo(){}"}}'
    );
    assert.equal(
      rttc.stringifyHuman([{x:{y:function foo (){}}}], [{x:{y:'lamda'}}]),
      '[{"x":{"y":"function foo(){}"}}]'
    );
    assert.equal(
      rttc.stringifyHuman([function foo (){}], ['lamda']),
      '["function foo(){}"]'
    );
  });


  describe('edge-cases', function (){

    it('should refuse to work if not provided a type schema', function() {
      assert.throws(function (){
        rttc.stringifyHuman(4);
      });
    });

    describe('stringification cannot be safely reversed', function(){

      // Against `json`
      it('should throw when given a function against type: `ref`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(function asdf(){}, 'ref');
        });
      });
      it('should throw when given an Error against type: `ref`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(new Error('foo'), 'ref');
        });
      });
      it('should throw when given a Date against type: `ref`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(new Date('foo'), 'ref');
        });
      });
      it('should throw when given a RegExp against type: `ref`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(/sadg/g, 'ref');
        });
      });
      it('should throw when given a Stream against type: `ref`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(new (require('stream').Readable)(), 'ref');
        });
        assert.throws(function (){
          rttc.stringifyHuman(new (require('stream').Stream)(), 'ref');
        });
      });
      it('should throw when given a Buffer against type: `ref`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(new Buffer(), 'ref');
        });
      });
      it('should throw when given Infinity, -Infinity, or NaN against type: `ref`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(Infinity, 'ref');
        });
        assert.throws(function (){
          rttc.stringifyHuman(-Infinity, 'ref');
        });
        assert.throws(function (){
          rttc.stringifyHuman(NaN, 'ref');
        });
      });

      // Against `json`
      it('should throw when given a function against type: `json`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(function asdf(){}, 'json');
        });
      });
      it('should throw when given an Error against type: `json`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(new Error('foo'), 'json');
        });
      });
      it('should throw when given a Date against type: `json`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(new Date('foo'), 'json');
        });
      });
      it('should throw when given a RegExp against type: `json`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(/sadg/g, 'json');
        });
      });
      it('should throw when given a Stream against type: `json`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(new (require('stream').Readable)(), 'json');
        });
        assert.throws(function (){
          rttc.stringifyHuman(new (require('stream').Stream)(), 'json');
        });
      });
      it('should throw when given a Buffer against type: `json`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(new Buffer(), 'json');
        });
      });
      it('should throw when given Infinity, -Infinity, or NaN against type: `json`',function(){
        assert.throws(function (){
          rttc.stringifyHuman(Infinity, 'json');
        });
        assert.throws(function (){
          rttc.stringifyHuman(-Infinity, 'json');
        });
        assert.throws(function (){
          rttc.stringifyHuman(NaN, 'json');
        });
      });
    });

    it('should refuse to work if value does not strictly validate against type schema', function() {
      assert.throws(function (){
        rttc.stringifyHuman('whatever', 'lamda');
      });
      assert.throws(function (){
        rttc.stringifyHuman('whatever', 'boolean');
      });
      assert.throws(function (){
        rttc.stringifyHuman(4, 'boolean');
      });
      assert.throws(function (){
        rttc.stringifyHuman(4, 'string');
      });
      assert.throws(function (){
        rttc.stringifyHuman('4', 'number');
      });
      assert.throws(function(){
        rttc.stringifyHuman(function asdf(){}, 'json');
      });
    });

  });

});
