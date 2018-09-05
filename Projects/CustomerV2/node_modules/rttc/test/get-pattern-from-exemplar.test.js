var assert = require('assert');
var rttc = require('../');

describe('.getPatternFromExemplar()', function() {

  it('should return the pattern from single-item array exemplars', function() {
    assert.strictEqual(rttc.getPatternFromExemplar(['foo']), 'foo');
    assert.strictEqual(rttc.getPatternFromExemplar(['']), '');
    assert.strictEqual(rttc.getPatternFromExemplar([2323]), 2323);
    assert.strictEqual(rttc.getPatternFromExemplar([0]), 0);
    assert.strictEqual(rttc.getPatternFromExemplar([true]), true);
    assert.strictEqual(rttc.getPatternFromExemplar([false]), false);
    assert.deepEqual(rttc.getPatternFromExemplar([[]]), []);
    assert.deepEqual(rttc.getPatternFromExemplar([{}]), {});
    assert.deepEqual(rttc.getPatternFromExemplar([{x:30,y:40}]), {x:30,y:40});
    assert.deepEqual(rttc.getPatternFromExemplar(['*']), '*');
    assert.deepEqual(rttc.getPatternFromExemplar(['->']), '->');
    assert.deepEqual(rttc.getPatternFromExemplar(['===']), '===');

    // A few deep test cases just to mix things up.
    assert.deepEqual(rttc.getPatternFromExemplar([[{x:30,y:40}]]), [{x:30,y:40}]);
    assert.deepEqual(rttc.getPatternFromExemplar([['===']]), ['===']);
    assert.deepEqual(rttc.getPatternFromExemplar([[[false]]]), [[false]]);
    assert.deepEqual(rttc.getPatternFromExemplar([[[{x:30, y:40, otherCoordinates: [{x:100,y:200,z:-300.5}]}]]]), [[{x:30, y:40, otherCoordinates: [{x:100,y:200,z:-300.5}]}]]);
  });

  it('should return "*" given []  (because [] is really just the same thing as ["*"])', function() {
    assert.strictEqual(rttc.getPatternFromExemplar([]), '*');
  });

  it('should throw if given a multi-item array', function() {
    assert.throws(function (){
      rttc.getPatternFromExemplar(['a','b','c']);
    });
  });

  it('should throw if given a non-array', function() {
    assert.throws(function (){
      rttc.getPatternFromExemplar({x:292, y:-49});
    });
  });

});
