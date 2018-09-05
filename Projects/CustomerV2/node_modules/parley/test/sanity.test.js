/**
 * Module dependencies
 */

var util = require('util');
var _ = require('@sailshq/lodash');
var parley = require('../');



/**
 * sanity.test.js
 *
 * A test of parley's most basic usage.
 *
 * > This is really just a sanity check to make sure there are no
 * > unexpected problems in the simplest assumptions of this module.
 */

describe('parley()', function() {
  it('should throw', function(){
    try { parley(); }
    catch (e) { return; }
    throw new Error('Should have thrown an Error');
  });
});


describe('parley(handleExec)', function() {

  describe('with invalid handleExec', function (){
    it('should throw', function(){
      try { parley(123); }
      catch (e) { return; }
      throw new Error('Should have thrown an Error');
    });
    it('should throw', function(){
      try { parley([123, 456]); }
      catch (e) { return; }
      throw new Error('Should have thrown an Error');
    });
  });

  describe('with valid handleExec', function (){
    var π;
    it('should not throw', function(){
      π = parley(function (done){ return done(); });
    });
    it('should have returned an object of some sort', function(){
      if (!_.isObject(π)) { throw new Error('Instead got: '+util.inspect(π,{depth:5})+''); }
    });
    describe('deferred object (the "parley" itself)', function (){
      it('should have an `.exec()` method', function(){
        if (!_.isFunction(π.exec)) { throw new Error('Instead got: '+util.inspect(π.exec,{depth:5})+''); }
      });
      it('should have a `.then()` method', function(){
        if (!_.isFunction(π.then)) { throw new Error('Instead got: '+util.inspect(π.then,{depth:5})+''); }
      });
      it('should have a `.catch()` method', function(){
        if (!_.isFunction(π.catch)) { throw new Error('Instead got: '+util.inspect(π.catch,{depth:5})+''); }
      });
      it('should have a `.toPromise()` method', function(){
        if (!_.isFunction(π.toPromise)) { throw new Error('Instead got: '+util.inspect(π.toPromise,{depth:5})+''); }
      });
    });
  });

});

