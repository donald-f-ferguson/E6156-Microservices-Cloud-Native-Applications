var util = require('util');
var assert = require('assert');
var infer = require('../lib/infer');

describe('Inferring type schema from example', function() {


  // ------------------------------------------------------------
  // Primitive examples
  // ------------------------------------------------------------

  describe('when primitive values are used', function() {

    it('should set type "string"', function() {
      var type = infer('foo');
      assert.strictEqual(type, 'string');

      type = infer('');
      assert.strictEqual(type, 'string');
    });

    it('should set type "number"', function() {
      var type = infer(5);
      assert.strictEqual(type, 'number');

      infer(-5);
      assert.strictEqual(type, 'number');

      infer(0);
      assert.strictEqual(type, 'number');

      infer(5.3);
      assert.strictEqual(type, 'number');

      infer(-5.2);
      assert.strictEqual(type, 'number');
    });

    it('should set type "boolean"', function() {
      var type = infer(false);
      assert.strictEqual(type, 'boolean');

      type = infer(true);
      assert.strictEqual(type, 'boolean');
    });

    it('should set type "ref" for "===" and `undefined`', function() {
      assert.strictEqual( infer('==='), 'ref' );
      assert.strictEqual( infer(undefined), 'ref' );
    });

    it('should set type "json" for "*"', function() {
      assert.strictEqual( infer('*'), 'json' );
    });

    it('should set type "lamda" for "->", "<-", "-->", "<--", "<==", "==>", "=>", "<="', function() {
      assert.strictEqual( infer('->'), 'lamda' );
      assert.strictEqual( infer('<-'), 'lamda' );
      assert.strictEqual( infer('=>'), 'lamda' );
      assert.strictEqual( infer('<='), 'lamda' );
      assert.strictEqual( infer('-->'), 'lamda' );
      assert.strictEqual( infer('<--'), 'lamda' );
      assert.strictEqual( infer('==>'), 'lamda' );
      assert.strictEqual( infer('<=='), 'lamda' );
    });

  });






  // ------------------------------------------------------------
  // Weird examples
  // ------------------------------------------------------------

  describe('when weird values are used', function() {

    it('should reject `null`', function() {
      assert.equal(infer(null), undefined);
    });

  });





  // ------------------------------------------------------------
  // Array examples
  // ------------------------------------------------------------

  describe('when an array of primitives is used', function() {

    it('should parse an array with a single string', function() {
      var arr = ['foo'];
      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert.strictEqual(schema[0], 'string');
    });

    it('should parse an array with a single number', function() {
      var arr = [1];
      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert.strictEqual(schema[0], 'number');
    });

    it('should parse an array with a single `true`', function() {
      var arr = [true];
      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert.strictEqual(schema[0], 'boolean');
    });

    it('should parse an array with a single `false`', function() {
      var arr = [false];
      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert.strictEqual(schema[0], 'boolean');
    });

  });

  describe('when an array of objects is used', function() {

    it('should parse an array with a single level object', function() {
      var arr = [{
        foo: 'bar',
        bar: 3,
        baz: false
      }];

      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert(schema[0].foo);
      assert(schema[0].bar);
      assert(schema[0].baz);
      assert.strictEqual(schema[0].foo, 'string');
      assert.strictEqual(schema[0].bar, 'number');
      assert.strictEqual(schema[0].baz, 'boolean');
    });

    it('should parse an array with a nested object', function() {
      var arr = [{
        foo: 'bar',
        bar: {
          foo: false,
          baz: {
            foo: 3
          }
        }
      }];

      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert(schema[0].foo);
      assert(schema[0].bar);
      assert(schema[0].bar.foo);
      assert(schema[0].bar.baz);
      assert(schema[0].bar.baz.foo);

      assert.strictEqual(schema[0].foo, 'string');
      assert.strictEqual(schema[0].bar.foo, 'boolean');
      assert.strictEqual(schema[0].bar.baz.foo, 'number');
    });

    it('should parse an array with many nested objects', function() {
      var arr = [{
        foo: 'bar',
        bar: {
          foo: false,
          baz: {
            foo: 3,
            bar: {
              baz: 'hi'
            }
          }
        }
      }];

      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert(schema[0].foo);
      assert(schema[0].bar);
      assert(schema[0].bar.foo);
      assert(schema[0].bar.baz);
      assert(schema[0].bar.baz.foo);
      assert(schema[0].bar.baz.bar);
      assert(schema[0].bar.baz.bar.baz);

      assert.strictEqual(schema[0].foo, 'string');
      assert.strictEqual(schema[0].bar.foo, 'boolean');
      assert.strictEqual(schema[0].bar.baz.foo, 'number');
      assert.strictEqual(schema[0].bar.baz.bar.baz, 'string');
    });


    it('should parse an array with a nested array', function() {
      var arr = [['foo']];

      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert(Array.isArray(schema[0]), 'expected [0] to exist in:'+util.inspect(schema, false, null));
      assert.strictEqual(schema[0].length, 1);

      assert(schema[0][0],'expected [0][0] to exist in:'+util.inspect(schema, false, null));

      assert.strictEqual(schema[0][0], 'string');
    });

    it('should parse an array with a nested array of nested objects', function() {
      var arr = [
        [{
          foo: {
            bar: false,
            baz: 235,
            mom: {
              name: 'Melinda'
            }
          }
        }]
      ];

      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert(Array.isArray(schema[0]));
      assert.strictEqual(schema[0].length, 1);

      assert(schema[0][0].foo);
      assert(schema[0][0].foo.bar);
      assert(schema[0][0].foo.baz);
      assert(schema[0][0].foo.mom);
      assert(schema[0][0].foo.mom.name);

      assert.strictEqual(schema[0][0].foo.bar, 'boolean');
      assert.strictEqual(schema[0][0].foo.baz, 'number');
      assert.strictEqual(schema[0][0].foo.mom.name, 'string');
    });


    it('should parse an array with many nested objects containing more arrays', function() {
      var arr = [{
        foo: 'bar',
        bar: {
          foo: false,
          baz: {
            foo: 3,
            bar: {
              baz: ['hi']
            }
          }
        }
      }];

      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert(schema[0].foo);
      assert(schema[0].bar);
      assert(schema[0].bar.foo);
      assert(schema[0].bar.baz);
      assert(schema[0].bar.baz.foo);
      assert(schema[0].bar.baz.bar);
      assert(schema[0].bar.baz.bar.baz, 'expected [0].bar.baz.bar.baz to exist in:'+util.inspect(schema, false, null));
      assert(schema[0].bar.baz.bar.baz[0]);

      assert.strictEqual(schema[0].foo, 'string');
      assert.strictEqual(schema[0].bar.foo, 'boolean');
      assert.strictEqual(schema[0].bar.baz.foo, 'number');
      assert(Array.isArray(schema[0].bar.baz.bar.baz));
      assert.strictEqual(schema[0].bar.baz.bar.baz.length, 1);
      assert.strictEqual(schema[0].bar.baz.bar.baz[0], 'string');
    });


    it('should parse an array with many nested objects containing more arrays of nested objects', function() {
      var arr = [{
        foo: 'bar',
        bar: {
          foo: false,
          baz: {
            foo: 3,
            bar: {
              baz: [{
                message: 'hi'
              }]
            }
          }
        }
      }];

      var schema = infer(arr);

      assert(Array.isArray(schema));
      assert.strictEqual(schema.length, 1);

      assert(schema[0].foo);
      assert(schema[0].bar);
      assert(schema[0].bar.foo);
      assert(schema[0].bar.baz);
      assert(schema[0].bar.baz.foo);
      assert(schema[0].bar.baz.bar);
      assert(schema[0].bar.baz.bar.baz);
      assert(schema[0].bar.baz.bar.baz[0]);
      assert(schema[0].bar.baz.bar.baz[0].message);

      assert.strictEqual(schema[0].foo, 'string');
      assert.strictEqual(schema[0].bar.foo, 'boolean');
      assert.strictEqual(schema[0].bar.baz.foo, 'number');
      assert(Array.isArray(schema[0].bar.baz.bar.baz));
      assert.strictEqual(schema[0].bar.baz.bar.baz.length, 1);
      assert.strictEqual(schema[0].bar.baz.bar.baz[0].message, 'string');
    });

  });






  // ------------------------------------------------------------
  // Other object examples
  // ------------------------------------------------------------

  describe('when an object is used', function() {

    it('should parse a single level object', function() {
      var obj = {
        foo: 'bar',
        bar: 3,
        baz: false
      };

      var schema = infer(obj);

      assert(schema.foo);
      assert(schema.bar);
      assert(schema.baz);
      assert.strictEqual(schema.foo, 'string');
      assert.strictEqual(schema.bar, 'number');
      assert.strictEqual(schema.baz, 'boolean');
    });

    it('should parse a nested object', function() {
      var obj = {
        foo: 'bar',
        bar: {
          foo: false,
          baz: {
            foo: 3
          }
        }
      };

      var schema = infer(obj);

      assert(schema.foo);
      assert(schema.bar);
      assert(schema.bar.foo);
      assert(schema.bar.baz);
      assert(schema.bar.baz.foo);

      assert.strictEqual(schema.foo, 'string');
      assert.strictEqual(schema.bar.foo, 'boolean');
      assert.strictEqual(schema.bar.baz.foo, 'number');
    });

  });



});
