var assert = require('assert');
var rttc = require('../');

describe('.dehydrate()', function() {

  it('should normally not run toJSON() methods on dictionaries', function() {
    var THING = {foo: 'bar', toJSON: function(){ return 'toJSON-ed thing'; } };

    assert.deepEqual(
      rttc.dehydrate(THING),
      {
        foo: 'bar',
        toJSON: rttc.dehydrate(function(){ return 'toJSON-ed thing'; })
      }
    );

    assert.deepEqual(
      rttc.dehydrate(THING, undefined, undefined, undefined, true),
      'toJSON-ed thing'
    );

  });


  it('should NEVER run toJSON() methods on arrays', function() {
    var THING = ['foo', 'bar', 'baz'];
    THING.toJSON = function(){ return 'toJSON-ed thing'; };

    assert.deepEqual(
      rttc.dehydrate(THING),
      ['foo', 'bar', 'baz']
    );

    assert.deepEqual(
      rttc.dehydrate(THING, undefined, undefined, undefined, true),
      ['foo', 'bar', 'baz']
    );

  });

});
