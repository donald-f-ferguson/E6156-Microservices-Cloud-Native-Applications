/**
 * Module dependencies
 */

var util = require('util');
var assert = require('assert');
var _ = require('@sailshq/lodash');
var parley = require('../');



/**
 * behavior.test.js
 *
 * Tests verifying parley's behavior with both callback and promise usage.
 */

describe('behavior.test.js', function() {


  //     ███████╗██╗  ██╗███████╗ ██████╗ ██╗██╗
  //     ██╔════╝╚██╗██╔╝██╔════╝██╔════╝██╔╝╚██╗
  //     █████╗   ╚███╔╝ █████╗  ██║     ██║  ██║
  //     ██╔══╝   ██╔██╗ ██╔══╝  ██║     ██║  ██║
  //  ██╗███████╗██╔╝ ██╗███████╗╚██████╗╚██╗██╔╝
  //  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚═╝
  //
  describe('.exec()', function() {
    describe('with proper usage', function() {
      var deferred; before(function(){ deferred = parley(function(done){ setTimeout(function (){ return done(undefined, 'hello!'); }, 12); }); });
      it('should work', function(done){
        deferred.exec(function(err) {
          if (err) { return done(err); }
          return done();
        });
      });
    });
    describe('when called more than once', function() {
      var deferred; before(function(){ deferred = parley(function(done){ setTimeout(function (){ return done(undefined, 'hello!'); }, 12); }); });
      it('should ignore subsequent calls', function(done){
        this.slow(300);

        // As a hack, override console.warn().
        // (this is mainly to improve the experience of looking at test results,
        // but it also has the benefit of adding another check.)
        var origConsoleWarn = global.console.warn;
        var counter = 0;
        global.console.warn = function(){
          counter++;
        };

        deferred.exec(function (){
          setTimeout(function (){
            global.console.warn = origConsoleWarn;
            try {
              assert.equal(counter, 3);
            } catch(e) { return done(e); }
            return done();
          }, 125);
        });

        // The following .exec() calls will be ignored.
        // (Note that 3 extra warnings will be logged, though.)
        deferred.exec(function (){
          return done(new Error('Should never make it here'));
        });
        deferred.exec(function (){
          return done(new Error('Should never make it here'));
        });
        deferred.exec(function (){
          return done(new Error('Should never make it here'));
        });
      });
    });
    describe('with invalid callback', function() {
      var deferred; before(function(){ deferred = parley(function(done){ setTimeout(function (){ return done(undefined, 'hello!'); }, 12); }); });
      it('should throw', function(){
        try { deferred.exec(123); }
        catch (e) { return; }
        throw new Error('Should have thrown an Error');
      });
    });
    describe('with no arguments', function() {
      var deferred; before(function(){ deferred = parley(function(done){ setTimeout(function (){ return done(undefined, 'hello!'); }, 12); }); });
      it('should throw', function(){
        try { deferred.exec(); }
        catch (e) { return; }
        throw new Error('Should have thrown an Error');
      });
    });
    describe('with two arguments and a callback that throws an uncaught exception', function() {
      var deferred; before(function(){ deferred = parley(function(done){ setTimeout(function (){ return done(undefined, 'hello!'); }, 12); }); });
      it('should run uncaught exception handler', function(done){
        this.slow(300);

        deferred.exec(function (){
          throw new Error('This is uncaught!  Watch out!');
        }, function(uncaughtError) {
          try {
            assert.equal(uncaughtError.message, 'This is uncaught!  Watch out!');
          } catch (e) { return done(e); }
          return done();
        });

      });
    });
  });//</.exec()>


  //  ████████╗██╗  ██╗███████╗███╗   ██╗ ██╗██╗
  //  ╚══██╔══╝██║  ██║██╔════╝████╗  ██║██╔╝╚██╗
  //     ██║   ███████║█████╗  ██╔██╗ ██║██║  ██║
  //     ██║   ██╔══██║██╔══╝  ██║╚██╗██║██║  ██║
  //  ██╗██║   ██║  ██║███████╗██║ ╚████║╚██╗██╔╝
  //  ╚═╝╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝ ╚═╝╚═╝
  //
  describe('.then()', function() {
    describe('with proper usage', function() {
      var deferred; before(function(){ deferred = parley(function(done){ setTimeout(function (){ return done(undefined, 'hello!'); }, 12); }); });
      it('should work', function(done){
        deferred.then(function(result) {
          return done();
        }).catch(function(err){ return done(err); });
      });
    });
    describe('when called more than once', function() {
      var deferred; before(function(){ deferred = parley(function(done){ setTimeout(function (){ return done(undefined, 'hello!'); }, 12); }); });
      it('should do the normal promise chaining thing', function(done){
        this.slow(300);

        deferred.then(function (){
          // do nothing
        }).catch(function(err){ return done(err); });

        // The following .then() calls will all run in order.
        deferred.then(function (){
          // do nothing
        }).catch(function(err){ return done(err); });
        deferred.then(function (){
          // do nothing
        }).catch(function(err){ return done(err); });
        deferred.then(function (){
          return done();
        }).catch(function(err){ return done(err); });
      });
    });
  });//</.then()>


  //  ██╗    ██╗    ██╗     ██████╗██╗   ██╗███████╗████████╗ ██████╗ ███╗   ███╗
  //  ██║    ██║   ██╔╝    ██╔════╝██║   ██║██╔════╝╚══██╔══╝██╔═══██╗████╗ ████║
  //  ██║ █╗ ██║  ██╔╝     ██║     ██║   ██║███████╗   ██║   ██║   ██║██╔████╔██║
  //  ██║███╗██║ ██╔╝      ██║     ██║   ██║╚════██║   ██║   ██║   ██║██║╚██╔╝██║
  //  ╚███╔███╔╝██╔╝       ╚██████╗╚██████╔╝███████║   ██║   ╚██████╔╝██║ ╚═╝ ██║
  //   ╚══╝╚══╝ ╚═╝         ╚═════╝ ╚═════╝ ╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝
  //
  //  ███╗   ███╗███████╗████████╗██╗  ██╗ ██████╗ ██████╗ ███████╗
  //  ████╗ ████║██╔════╝╚══██╔══╝██║  ██║██╔═══██╗██╔══██╗██╔════╝
  //  ██╔████╔██║█████╗     ██║   ███████║██║   ██║██║  ██║███████╗
  //  ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██║   ██║██║  ██║╚════██║
  //  ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║╚██████╔╝██████╔╝███████║
  //  ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
  //
  describe('building and/or executing a deferred that uses one or more custom methods', function(){

    //  ┌┐┌┌─┐┬─┐┌┬┐┌─┐┬    ┌─┐┌─┐┌─┐┌─┐
    //  ││││ │├┬┘│││├─┤│    │  ├─┤└─┐├┤
    //  ┘└┘└─┘┴└─┴ ┴┴ ┴┴─┘  └─┘┴ ┴└─┘└─┘
    describe('where everything is valid and normal', function(){
      it('should work', function(){
        var deferred = parley(function(done){
          setTimeout(function (){ return done(undefined, 'hello!'); }, 12);
        }, undefined, {
          foo: function (){ return deferred; }
        });
      });//</it>
    });//</ describe (valid & normal) >

    //  ┌─┐┬ ┬┌─┐┌┬┐┌─┐┌┬┐  ┌┬┐┌─┐┌┬┐┬ ┬┌─┐┌┬┐  ┌┐┌┌─┐┌┬┐┌─┐
    //  │  │ │└─┐ │ │ ││││  │││├┤  │ ├─┤│ │ ││  │││├─┤│││├┤
    //  └─┘└─┘└─┘ ┴ └─┘┴ ┴  ┴ ┴└─┘ ┴ ┴ ┴└─┘─┴┘  ┘└┘┴ ┴┴ ┴└─┘
    //  ╔═╗╔═╗╔╗╔╔═╗╦  ╦╔═╗╔╦╗╔═╗  ┬ ┬┬┌┬┐┬ ┬  ╦═╗╔═╗╔═╗╔═╗╦═╗╦  ╦╔═╗╔╦╗  ╔═╗╦═╗╔═╗╔═╗╔═╗╦═╗╔╦╗╦ ╦
    //  ║  ║ ║║║║╠╣ ║  ║║   ║ ╚═╗  ││││ │ ├─┤  ╠╦╝║╣ ╚═╗║╣ ╠╦╝╚╗╔╝║╣  ║║  ╠═╝╠╦╝║ ║╠═╝║╣ ╠╦╝ ║ ╚╦╝
    //  ╚═╝╚═╝╝╚╝╚  ╩═╝╩╚═╝ ╩ ╚═╝  └┴┘┴ ┴ ┴ ┴  ╩╚═╚═╝╚═╝╚═╝╩╚═ ╚╝ ╚═╝═╩╝  ╩  ╩╚═╚═╝╩  ╚═╝╩╚═ ╩  ╩
    describe('but where one or more custom methods have names which conflict with a reserved property', function(){

      describe('given `exec`', function(){
        it('should throw', function(){
          try {
            var deferred = parley(function(done){ throw new Error('Should never make it here.'); }, undefined, {
              foo: function (){ return deferred; },
              exec: function (){ return deferred; }
            });
          } catch (e) { return; }

          throw new Error('Should have thrown an Error');
        });//</it>
      });//</ describe >

      describe('given `toPromise`', function(){
        it('should throw', function(){
          try {
            var deferred = parley(function(done){ throw new Error('Should never make it here.'); }, undefined, {
              foo: function (){ return deferred; },
              toPromise: function (){ return deferred; }
            });
          } catch (e) { return; }

          throw new Error('Should have thrown an Error');
        });//</it>
      });//</ describe >

      describe('given `_hasBegunExecuting`', function(){
        it('should throw', function(){
          try {
            var deferred = parley(function(done){ throw new Error('Should never make it here.'); }, undefined, {
              foo: function (){ return deferred; },
              _hasBegunExecuting: function (){ return deferred; }
            });
          } catch (e) { return; }

          throw new Error('Should have thrown an Error');
        });//</it>
      });//</ describe >

      describe('given `constructor`', function(){
        it('should throw', function(){
          try {
            var deferred = parley(function(done){ throw new Error('Should never make it here.'); }, undefined, {
              foo: function (){ return deferred; },
              constructor: function (){ return deferred; }
            });
          } catch (e) { return; }

          throw new Error('Should have thrown an Error');
        });//</it>
      });//</ describe >

      describe('given `inspect`', function(){
        it('should throw', function(){
          try {
            var deferred = parley(function(done){ throw new Error('Should never make it here.'); }, undefined, {
              foo: function (){ return deferred; },
              inspect: function (){ return deferred; }
            });
          } catch (e) { return; }

          throw new Error('Should have thrown an Error');
        });//</it>
      });//</ describe >


    });//</ describe (custom method name conflicts w/ reserved property) >


  });//</ custom methods >

});


// // A few additional, ad hoc tests:
// // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// // Success condition:
// // ====================
// // .toPromise()
// π = require('./')({ codeName: 'asdf', handleExec: function foo(done){ console.log('working...');   setTimeout(function (){ console.log('finishing...'); return done(undefined, 'hello!'); }, 1000); } }); promise = π.toPromise();  promise.then(function(result){ console.log('done!', result); }).catch(function(err){ console.error('ERROR',err); });
// // .then() shortcut
// π = require('./')({ codeName: 'asdf', handleExec: function foo(done){ console.log('working...');   setTimeout(function (){ console.log('finishing...'); return done(undefined, 'hello!'); }, 1000); } }); π.then(function(result){ console.log('done!', result); }).catch(function(err){ console.error('ERROR',err); });
// // .exec()
// π = require('./')({ codeName: 'asdf', handleExec: function foo(done){ console.log('working...');   setTimeout(function (){ console.log('finishing...'); return done(undefined, 'hello!'); }, 1000); } }); π.exec(function(err, result){ if (err){ console.error('ERROR',err, result); return; } console.log('done!', err, result); });

// // Error condition:
// // ====================
// // .toPromise()
// π = require('./')({ codeName: 'asdf', handleExec: function foo(done){ console.log('working...');   setTimeout(function (){ console.log('finishing...'); return done(new Error('uh oh'), 'should never get this!'); }, 1000); } }); promise = π.toPromise();  promise.then(function(result){ console.log('done!', result); }).catch(function(err){ console.error('ERROR',err); });
// // .then() shortcut
// π = require('./')({ codeName: 'asdf', handleExec: function foo(done){ console.log('working...');   setTimeout(function (){ console.log('finishing...'); return done(new Error('uh oh'), 'should never get this!'); }, 1000); } }); π.then(function(result){ console.log('done!', result); }).catch(function(err){ console.error('ERROR',err); });
// // .catch() shortcut
// π = require('./')({ codeName: 'asdf', handleExec: function foo(done){ console.log('working...');   setTimeout(function (){ console.log('finishing...'); return done(new Error('uh oh'), 'should never get this!'); }, 1000); } }); π.catch(function(err){ console.error('ERROR',err); });
// // .exec()
// π = require('./')({ codeName: 'asdf', handleExec: function foo(done){ console.log('working...');   setTimeout(function (){ console.log('finishing...'); return done(new Error('uh oh'), 'should never get this!'); }, 1000); } }); π.exec(function(err, result){ if (err){ console.error('ERROR',err, result); return; } console.log('done!', err, result); });
// // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
