var util = require('util');
var assert = require('assert');
var _  = require('@sailshq/lodash');
var rttc = require('../');

describe('.reify()', function() {

  // TODO: test that this doesn't go nuts given circular objects
  // (they should never be circular because they are type schemas, but still, for everyone's sanity)

  it('should leave "string" alone', function() {
    assert.deepEqual( 'string', rttc.reify('string')   );
  });
  it('should leave "number" alone', function() {
    assert.deepEqual( 'number', rttc.reify('number')   );
  });
  it('should leave "boolean" alone', function() {
    assert.deepEqual( 'boolean', rttc.reify('boolean')   );
  });
  it('should leave "lamda" alone', function() {
    assert.deepEqual( 'lamda', rttc.reify('lamda')   );
  });
  it('should leave faceted dictionaries alone', function() {
    assert.deepEqual( {x: 'string'}, rttc.reify(  {x: 'string'}               )    );
    assert.deepEqual( {y:'number'}, rttc.reify(  {y:'number'}               )    );
    assert.deepEqual( {z: 'boolean'}, rttc.reify(  {z: 'boolean'}               )    );
    assert.deepEqual( {l: 'lamda'}, rttc.reify(  {l: 'lamda'}               )    );
    assert.deepEqual( {foo:'string', bar: 'boolean', baz: 'number'}, rttc.reify(  {foo:'string', bar: 'boolean', baz: 'number'}               )    );
    assert.deepEqual( {x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  } , rttc.reify(  {x: ['string'], y: ['number'], z: ['boolean'], l:{a:{m:{d:{a:'lamda'}}}}  }               )    );
  });
  it('should leave patterned arrays alone', function() {
    assert.deepEqual(   ['string']               , rttc.reify(  ['string']               )    );
    assert.deepEqual(   ['number']               , rttc.reify(  ['number']               )    );
    assert.deepEqual(   ['boolean']               , rttc.reify(  ['boolean']               )    );
    assert.deepEqual(   ['lamda']               , rttc.reify(  ['lamda']               )    );
    assert.deepEqual(   [{foo:'string', bar: 'boolean', baz: 'number'}]               , rttc.reify(  [{foo:'string', bar: 'boolean', baz: 'number'}]               )    );
    assert.deepEqual(   [['string']]               , rttc.reify(  [['string']]               )    );
    assert.deepEqual(   [['number']]               , rttc.reify(  [['number']]               )    );
    assert.deepEqual(   [['boolean']]               , rttc.reify(  [['boolean']]               )    );
    assert.deepEqual(   [['lamda']]               , rttc.reify(  [['lamda']]               )    );
    assert.deepEqual(   [[{foo:'string', bar: 'boolean', baz: 'number'}]]               , rttc.reify(  [[{foo:'string', bar: 'boolean', baz: 'number'}]]               )    );
  });
  it('should collapse generic dictionaries', function() {
    assert( _.isUndefined(  rttc.reify({})  ) );
  });
  it('should collapse generic arrays', function() {
    assert( _.isUndefined(  rttc.reify([])  ) );
  });
  it('should collapse "json"', function() {
    assert( _.isUndefined(  rttc.reify('json')  ) );
  });
  it('should collapse "ref"', function() {
    assert( _.isUndefined(  rttc.reify('ref')  ) );
  });
  it('should collapse and strip nested generics', function() {
    var exhibitA = {
      foo: 'json',
      bar: {},
      baz: ['json'],
      bang: [{
        a: {
          x: 'ref'
        },
        b: 'lamda'
      }],
      beep: ['string'],
      boop: {
        hello: 'string',
        world: 'json'
      }
    };
    var reified = {
      bang: [{
        b: 'lamda'
      }],
      beep: ['string'],
      boop: {
        hello: 'string'
      }
    };
    assert.deepEqual( reified, rttc.reify(exhibitA) );
  });


});

