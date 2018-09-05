/**
 * Module dependencies
 */

var assert = require('assert');
var _ = require('@sailshq/lodash');
var find = require('./fixtures/find.fixture');
var validateButWith9CustomMethods = require('./fixtures/validate-but-with-9-custom-methods.fixture');
var findButWithTimeout = require('./fixtures/find-but-with-timeout.fixture');
var findButWithFinalAfterExecLC = require('./fixtures/find-but-with-final-after-exec-lc.fixture');


/**
 * practical.test.js
 *
 * A simple test verifiying a couple of real-world use cases.
 */

describe('practical.test.js', function() {

  //  ██████╗ ██████╗ ███████╗████████╗███████╗███╗   ██╗██████╗
  //  ██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██╔════╝████╗  ██║██╔══██╗
  //  ██████╔╝██████╔╝█████╗     ██║   █████╗  ██╔██╗ ██║██║  ██║
  //  ██╔═══╝ ██╔══██╗██╔══╝     ██║   ██╔══╝  ██║╚██╗██║██║  ██║
  //  ██║     ██║  ██║███████╗   ██║   ███████╗██║ ╚████║██████╔╝
  //  ╚═╝     ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝╚═════╝
  //
  //     ███████╗██╗███╗   ██╗██████╗  ██╗██╗
  //     ██╔════╝██║████╗  ██║██╔══██╗██╔╝╚██╗
  //     █████╗  ██║██╔██╗ ██║██║  ██║██║  ██║
  //     ██╔══╝  ██║██║╚██╗██║██║  ██║██║  ██║
  //  ██╗██║     ██║██║ ╚████║██████╔╝╚██╗██╔╝
  //  ╚═╝╚═╝     ╚═╝╚═╝  ╚═══╝╚═════╝  ╚═╝╚═╝
  //
  describe('calling a simplified mock of Waterline\'s `find()` model method', function(){

    describe('simulated success', function(){

      it('should work with explicit callback', function(done){
        find(function (err, result) {
          if (err) { return done(err); }
          try {
            assert.deepEqual(result, [undefined]);
          } catch (e) { return done(e); }
          return done();
        });
      });
      it('should work with 1st arg + explicit callback', function(done){
        find({ where: {id:3} }, function (err, result) {
          if (err) { return done(err); }
          try {
            assert.deepEqual(result, [{ where:{id:3} }]);
          } catch (e) { return done(e); }
          return done();
        });
      });

      it('should work with .exec()', function(done){
        find().exec(function (err, result) {
          if (err) { return done(err); }
          try {
            assert.deepEqual(result, [undefined]);
          } catch (e) { return done(e); }
          return done();
        });
      });
      it('should work with 1st arg + .exec()', function(done){
        find({ where: {id:3} }).exec(function (err, result) {
          if (err) { return done(err); }
          try {
            assert.deepEqual(result, [{ where:{id:3} }]);
          } catch (e) { return done(e); }
          return done();
        });
      });
      it('should work with .where() + .exec()', function(done){
        find()
        .where({id:4})
        .exec(function (err, result) {
          if (err) { return done(err); }
          try {
            assert.deepEqual(result, [{ where:{id:4} }]);
          } catch (e) { return done(e); }
          return done();
        });
      });
      it('should work with 1st arg + .where() + .exec()', function(done){
        find({ where: {id:3, x:30} })
        .where({id:4})
        .exec(function (err, result) {
          if (err) { return done(err); }
          try {
            assert.deepEqual(result, [{ where:{id:4} }]);
          } catch (e) { return done(e); }
          return done();
        });
      });

    });//</ simulated success >

  });//</ calling simulated .find() >


  //  ██╗   ██╗███████╗██╗███╗   ██╗ ██████╗      ██████╗██╗   ██╗███████╗████████╗ ██████╗ ███╗   ███╗
  //  ██║   ██║██╔════╝██║████╗  ██║██╔════╝     ██╔════╝██║   ██║██╔════╝╚══██╔══╝██╔═══██╗████╗ ████║
  //  ██║   ██║███████╗██║██╔██╗ ██║██║  ███╗    ██║     ██║   ██║███████╗   ██║   ██║   ██║██╔████╔██║
  //  ██║   ██║╚════██║██║██║╚██╗██║██║   ██║    ██║     ██║   ██║╚════██║   ██║   ██║   ██║██║╚██╔╝██║
  //  ╚██████╔╝███████║██║██║ ╚████║╚██████╔╝    ╚██████╗╚██████╔╝███████║   ██║   ╚██████╔╝██║ ╚═╝ ██║
  //   ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝      ╚═════╝ ╚═════╝ ╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝
  //
  //  ███╗   ███╗███████╗████████╗██╗  ██╗ ██████╗ ██████╗ ███████╗
  //  ████╗ ████║██╔════╝╚══██╔══╝██║  ██║██╔═══██╗██╔══██╗██╔════╝
  //  ██╔████╔██║█████╗     ██║   ███████║██║   ██║██║  ██║███████╗
  //  ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██║   ██║██║  ██║╚════██║
  //  ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║╚██████╔╝██████╔╝███████║
  //  ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
  //
  describe('calling something that takes advantage of parley\'s built-in support for custom methods', function(){

    it('should work with explicit callback', function(done){
      validateButWith9CustomMethods(function (err, result) {
        if (err) { return done(err); }
        try {
          assert.strictEqual(result, undefined);
        } catch (e) { return done(e); }
        return done();
      });
    });

    it('should work with .exec()', function(done){
      validateButWith9CustomMethods().exec(function (err, result) {
        if (err) { return done(err); }
        try {
          assert.strictEqual(result, undefined);
        } catch (e) { return done(e); }
        return done();
      });
    });

    it('should work with .then()', function(done){
      validateButWith9CustomMethods()
      .then(function (result) {
        try {
          assert.strictEqual(result, undefined);
        } catch (e) { return done(e); }
        return done();
      }).catch(function(err) { return done(err); });
    });

    it('should work with .b() + .exec()', function(done){
      validateButWith9CustomMethods()
      .b({id:4})
      .exec(function (err, result) {
        if (err) { return done(err); }
        try {
          assert.strictEqual(result, undefined);
        } catch (e) { return done(e); }
        return done();
      });
    });

    it('should work with .b() + .then()', function(done){
      validateButWith9CustomMethods()
      .b({id:4})
      .then(function (result) {
        try {
          assert.strictEqual(result, undefined);
        } catch (e) { return done(e); }
        return done();
      }).catch(function(err) { return done(err); });
    });

  });//</ calling something that takes advantage of parley\'s built-in support for custom methods >




  //  ██╗   ██╗███████╗██╗███╗   ██╗ ██████╗
  //  ██║   ██║██╔════╝██║████╗  ██║██╔════╝
  //  ██║   ██║███████╗██║██╔██╗ ██║██║  ███╗
  //  ██║   ██║╚════██║██║██║╚██╗██║██║   ██║
  //  ╚██████╔╝███████║██║██║ ╚████║╚██████╔╝
  //   ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝
  //
  //  ████████╗██╗███╗   ███╗███████╗ ██████╗ ██╗   ██╗████████╗
  //  ╚══██╔══╝██║████╗ ████║██╔════╝██╔═══██╗██║   ██║╚══██╔══╝
  //     ██║   ██║██╔████╔██║█████╗  ██║   ██║██║   ██║   ██║
  //     ██║   ██║██║╚██╔╝██║██╔══╝  ██║   ██║██║   ██║   ██║
  //     ██║   ██║██║ ╚═╝ ██║███████╗╚██████╔╝╚██████╔╝   ██║
  //     ╚═╝   ╚═╝╚═╝     ╚═╝╚══════╝ ╚═════╝  ╚═════╝    ╚═╝
  //
  describe('calling something that takes advantage of parley\'s built-in support for timeouts', function(){

    describe('in cases where timeout is explicitly unsupported', function(){

      it('should NOT RESPECT TIMEOUT WHEN given an explicit callback', function(done){
        findButWithTimeout(function (err, result) {
          if (err) { return done(err); }
          try {
            assert.deepEqual(result, [undefined]);
          } catch (e) { return done(e); }
          return done();
        });
      });
      it('should NOT RESPECT TIMEOUT WHEN given 1st arg + explicit callback', function(done){
        findButWithTimeout({ where: {id:3} }, function (err, result) {
          if (err) { return done(err); }
          try {
            assert.deepEqual(result, [{ where:{id:3} }]);
          } catch (e) { return done(e); }
          return done();
        });
      });

    });


    describe('in cases where timeout is supposed to work', function(){

      it('should time out properly given .exec()', function(done){
        findButWithTimeout().exec(function (err, result) {
          try {
            assert.equal(err.name, 'TimeoutError');
          } catch (e) { return done(e); }
          return done();
        });
      });
      it('should time out properly given 1st arg + .exec()', function(done){
        findButWithTimeout({ where: {id:3} }).exec(function (err, result) {
          try {
            assert.equal(err.name, 'TimeoutError');
          } catch (e) { return done(e); }
          return done();
        });
      });
      it('should time out properly given .where() + .exec()', function(done){
        findButWithTimeout()
        .where({id:4})
        .exec(function (err, result) {
          try {
            assert.equal(err.name, 'TimeoutError');
          } catch (e) { return done(e); }
          return done();
        });
      });
      it('should time out properly given 1st arg + .where() + .exec()', function(done){
        findButWithTimeout({ where: {id:3, x:30} })
        .where({id:4})
        .exec(function (err) {
          try {
            assert.equal(err.name, 'TimeoutError');
          } catch (e) { return done(e); }
          return done();
        });
      });

    });



  });//</ calling something that takes advantage of parley\'s built-in support for timeouts >


  //  ██╗   ██╗███████╗██╗███╗   ██╗ ██████╗     ██╗      ██████╗
  //  ██║   ██║██╔════╝██║████╗  ██║██╔════╝     ██║     ██╔════╝██╗
  //  ██║   ██║███████╗██║██╔██╗ ██║██║  ███╗    ██║     ██║     ╚═╝
  //  ██║   ██║╚════██║██║██║╚██╗██║██║   ██║    ██║     ██║     ██╗
  //  ╚██████╔╝███████║██║██║ ╚████║╚██████╔╝    ███████╗╚██████╗╚═╝
  //   ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝     ╚══════╝ ╚═════╝
  //
  //  ██╗███╗   ██╗████████╗███████╗██████╗  ██████╗███████╗██████╗ ████████╗ █████╗ ███████╗████████╗███████╗██████╗ ███████╗██╗  ██╗███████╗ ██████╗
  //  ██║████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██╔════╝██╔════╝██╔══██╗╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗██╔════╝╚██╗██╔╝██╔════╝██╔════╝
  //  ██║██╔██╗ ██║   ██║   █████╗  ██████╔╝██║     █████╗  ██████╔╝   ██║   ███████║█████╗     ██║   █████╗  ██████╔╝█████╗   ╚███╔╝ █████╗  ██║
  //  ██║██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██║     ██╔══╝  ██╔═══╝    ██║   ██╔══██║██╔══╝     ██║   ██╔══╝  ██╔══██╗██╔══╝   ██╔██╗ ██╔══╝  ██║
  //  ██║██║ ╚████║   ██║   ███████╗██║  ██║╚██████╗███████╗██║        ██║   ██║  ██║██║        ██║   ███████╗██║  ██║███████╗██╔╝ ██╗███████╗╚██████╗
  //  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝ ╚═════╝╚══════╝╚═╝        ╚═╝   ╚═╝  ╚═╝╚═╝        ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝
  //
  describe('calling something that takes advantage of interceptAfterExec', function(){

    describe('in cases where interceptAfterExec is explicitly unsupported given an explicit callback with success (i.e. where the LC might normally modify the result/error if we were using .exec())', function(){

      it('should NOT RESPECT LC WHEN given explicit callback as first arg', function(done){
        findButWithFinalAfterExecLC(function (err, result) {
          if (err) { return done(err); }
          try {
            assert.deepEqual(result, [undefined]);
          } catch (e) { return done(e); }
          return done();
        });
      });
      it('should NOT RESPECT LC WHEN given 1st arg + explicit callback', function(done){
        findButWithFinalAfterExecLC({ where: {id:3} }, function (err, result) {
          if (err) { return done(err); }
          try {
            assert.deepEqual(result, [{ where:{id:3} }]);
          } catch (e) { return done(e); }
          return done();
        });
      });

    });


    describe('in cases where this is supposed to work', function(){

      it('should work normally given .exec() with an error, where the LC is a pass-through', function(done){
        findButWithFinalAfterExecLC(false).exec(function (err) {
          try {
            assert(_.isError(err), 'Expecting `err` to be an Error instance!  But instead got: '+err);
            assert.equal(err.code, 'E_SOME_ERROR', 'Expected error with a `code` of "E_SOME_ERROR".  But instead, got an error with a different code (`'+err.code+'`).  Here\'s the error: '+err);
          } catch (e) { return done(e); }
          return done();
        });
      });
      it('should work normally given .exec() with success, where the LC is a pass-through', function(done){
        findButWithFinalAfterExecLC(true).exec(function (err, result) {
          try {
            assert(!err, 'Got unexpected error in test: '+err);
            assert(_.isArray(result), 'Expecting result to be an array!  But instead got: '+result);
            assert.equal(result.length, 1);
            assert.equal(result[0], true);
          } catch (e) { return done(e); }
          return done();
        });
      });
      it('should properly apply changes from LC given .exec() with an error', function(done){
        findButWithFinalAfterExecLC(null).exec(function (err) {
          try {
            assert(_.isError(err), 'Expecting `err` to be an Error instance!  But instead got: '+err);
            assert.equal(err.code, 'E_SOME_UNRECOGNIZED_ERROR', 'Expected error with a `code` of "E_SOME_UNRECOGNIZED_ERROR".  But instead, got an error with a different code (`'+err.code+'`).  Here\'s the error: '+err);
          } catch (e) { return done(e); }
          return done();
        });
      });
      it('should properly apply changes from LC given .exec() with success', function(done){
        findButWithFinalAfterExecLC().exec(function (err, result) {
          try {
            assert(!err, 'Got unexpected error in test: '+err);
            assert(_.isArray(result), 'Expecting result to be an array!  But instead got: '+result);
            assert.equal(result.length, 2);
            assert.equal(result[0], undefined);
            assert.deepEqual(result[1], { fake: true });
          } catch (e) { return done(e); }
          return done();
        });
      });

    });


  });//</ calling something that takes advantage of interceptAfterExec >




  //     ██╗███╗   ██╗████████╗███████╗██████╗  ██████╗███████╗██████╗ ████████╗ ██╗██╗
  //     ██║████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██╔════╝██╔════╝██╔══██╗╚══██╔══╝██╔╝╚██╗
  //     ██║██╔██╗ ██║   ██║   █████╗  ██████╔╝██║     █████╗  ██████╔╝   ██║   ██║  ██║
  //     ██║██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██║     ██╔══╝  ██╔═══╝    ██║   ██║  ██║
  //  ██╗██║██║ ╚████║   ██║   ███████╗██║  ██║╚██████╗███████╗██║        ██║   ╚██╗██╔╝
  //  ╚═╝╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝ ╚═════╝╚══════╝╚═╝        ╚═╝    ╚═╝╚═╝
  //
  describe('calling find().intercept()', function(){

    it('should ignore `.intercept()` if find() returns successfully', function(done){
      var didRunIntercept;
      find()
      .intercept('E_SOME_ERROR', function(err){
        didRunIntercept = true;
        return err;
      })
      .exec(function (err, result) {
        if (err) { return done(err); }
        try {
          assert.deepEqual(result, [undefined]);
          assert(!didRunIntercept);
        } catch (e) { return done(e); }
        return done();
      });
    });

    it('should ignore `.intercept()` if find() throws an unrelated exception', function(done){
      var didRunIntercept;
      find(false)
      .intercept('E_SOME_OTHER_ERROR_THAT_WONT_BE_THROWN', function(err){
        didRunIntercept = true;
        return err;
      })
      .exec(function (err) {
        try {
          assert(_.isError(err), 'Expecting `err` to be an Error instance!  But instead got: '+err);
          assert.equal(err.code, 'E_SOME_ERROR', 'Expected error with a `code` of "E_SOME_ERROR".  But instead, got an error with a different code (`'+err.code+'`).  Here\'s the error: '+err);
          assert(!didRunIntercept);
        } catch (e) { return done(e); }
        return done();
      });
    });

    it('should run `.intercept()` if find() throws a matching exception, and the final error thrown should be whatever .intercept() returned', function(done){
      var didRunIntercept;
      find(false)
      .intercept('E_SOME_ERROR', function(err){
        didRunIntercept = true;
        var newErr = new Error('Some new error (original err:'+err+')');
        newErr.code = 'E_MASHED_POTATOES';
        return newErr;
      })
      .exec(function (err) {
        try {
          assert(_.isError(err), 'Expecting `err` to be an Error instance!  But instead got: '+err);
          assert.equal(err.code, 'E_MASHED_POTATOES', 'Expected error with a `code` of "E_MASHED_POTATOES", because it should have been intercepted and rethrown automatically using the return value from .intercept().  But instead, got an error with a different code (`'+err.code+'`).  Here\'s the error: '+err);
          assert(didRunIntercept);
        } catch (e) { return done(e); }
        return done();
      });
    });

    it('should pass in the proper error as the first and only argument to the LC', function(done){
      var argReceivedInLC;
      find(false)
      .intercept('E_SOME_ERROR', function(err){
        argReceivedInLC = err;
        var newErr = new Error('Some new error (original err:'+err+')');
        newErr.code = 'E_MASHED_POTATOES';
        return newErr;
      })
      .exec(function () {
        try {
          assert(_.isError(argReceivedInLC), 'Expecting arg received in LC to be an Error instance!  But instead got: '+argReceivedInLC);
          assert.equal(argReceivedInLC.code, 'E_SOME_ERROR', 'Expected error with a `code` of "E_SOME_ERROR".  But instead, got an error with a different code (`'+argReceivedInLC.code+'`).  Here\'s the error: '+argReceivedInLC);
        } catch (e) { return done(e); }
        return done();
      });
    });

    it('should still call the final after exec LC from implementorland, if one was configured (and it should call it last, with the modifications from this LC already taken into account)', function(done){
      findButWithFinalAfterExecLC(false)
      .intercept(function(err){
        return new Error('Some other error (interecepted from original error: '+err.stack+')');
      })
      .exec(function (err) {
        try {
          assert(_.isError(err), 'Expecting `err` to be an Error instance!  But instead got: '+err);
          assert.equal(err.code, 'E_SOME_UNRECOGNIZED_ERROR', 'Expected error with a `code` of "E_SOME_UNRECOGNIZED_ERROR".  But instead, got an error with a different code (`'+err.code+'`).  Here\'s the error: '+err);
        } catch (e) { return done(e); }
        return done();
      });
    });

  });//</ calling find().intercept() >

  //  ████████╗ ██████╗ ██╗     ███████╗██████╗  █████╗ ████████╗███████╗ ██╗██╗
  //  ╚══██╔══╝██╔═══██╗██║     ██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔╝╚██╗
  //     ██║   ██║   ██║██║     █████╗  ██████╔╝███████║   ██║   █████╗  ██║  ██║
  //     ██║   ██║   ██║██║     ██╔══╝  ██╔══██╗██╔══██║   ██║   ██╔══╝  ██║  ██║
  //  ██╗██║   ╚██████╔╝███████╗███████╗██║  ██║██║  ██║   ██║   ███████╗╚██╗██╔╝
  //  ╚═╝╚═╝    ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝ ╚═╝╚═╝
  //
  describe('calling .find().tolerate()', function(){

    it('should ignore `.tolerate()` if find() returns successfully', function(done){
      var didRunTolerate;
      find()
      .tolerate('E_SOME_ERROR', function(){
        didRunTolerate = true;
      })
      .exec(function (err, result) {
        if (err) { return done(err); }
        try {
          assert.deepEqual(result, [undefined]);
          assert(!didRunTolerate);
        } catch (e) { return done(e); }
        return done();
      });
    });

    it('should ignore `.tolerate()` if find() throws an unrelated exception', function(done){
      var didRunTolerate;
      find(false)
      .tolerate('E_SOME_OTHER_ERROR_THAT_WONT_BE_THROWN', function(){
        didRunTolerate = true;
      })
      .exec(function (err) {
        try {
          assert(_.isError(err), 'Expecting `err` to be an Error instance!  But instead got: '+err);
          assert.equal(err.code, 'E_SOME_ERROR', 'Expected error with a `code` of "E_SOME_ERROR".  But instead, got an error with a different code (`'+err.code+'`).  Here\'s the error: '+err);
          assert(!didRunTolerate);
        } catch (e) { return done(e); }
        return done();
      });
    });

    it('should run `.tolerate()` if find() throws a matching exception, and the final result should be whatever .tolerate() returned', function(done){
      var didRunTolerate;
      find(false)
      .tolerate('E_SOME_ERROR', function(){
        didRunTolerate = true;
        return 'mm mmm mashed potatoes';
      })
      .exec(function (err, result) {
        if (err) { return done(err); }
        try {
          assert(didRunTolerate);
          assert.deepEqual(result, 'mm mmm mashed potatoes');
        } catch (e) { return done(e); }
        return done();
      });
    });

    it('should honor `.tolerate()` even if it doesn\'t have a LC -- assuming find() throws a matching exception.  (In this case, the final result should be `undefined`.)', function(done){
      find(false)
      .tolerate('E_SOME_ERROR')
      .exec(function (err, result) {
        if (err) { return done(err); }
        try {
          assert.deepEqual(result, undefined);
        } catch (e) { return done(e); }
        return done();
      });
    });

    it('should run `.tolerate()` even if it is completely generic (i.e. not filtered by any rule at all) -- assuming find() throws any kind of error.  (In this case, the final result should be whatever the `.tolerate()` LC returned.)', function(done){
      var didRunTolerate;
      find(false)
      .tolerate(function(){
        didRunTolerate = true;
        return 'mm mmm mashed potatoes';
      })
      .exec(function (err, result) {
        if (err) { return done(err); }
        try {
          assert(didRunTolerate);
          assert.deepEqual(result, 'mm mmm mashed potatoes');
        } catch (e) { return done(e); }
        return done();
      });
    });

    it('should pass in the proper error as the first and only argument to the LC', function(done){
      var argReceivedInLC;
      find(false)
      .tolerate(function(err){
        argReceivedInLC = err;
      })
      .exec(function () {
        try {
          assert(_.isError(argReceivedInLC), 'Expecting arg received in LC to be an Error instance!  But instead got: '+argReceivedInLC);
          assert.equal(argReceivedInLC.code, 'E_SOME_ERROR', 'Expected error with a `code` of "E_SOME_ERROR".  But instead, got an error with a different code (`'+argReceivedInLC.code+'`).  Here\'s the error: '+argReceivedInLC);
        } catch (e) { return done(e); }
        return done();
      });
    });

    it('should still call the final after exec LC from implementorland, if one was configured (and it should call it last, with the modifications from this LC already taken into account)', function(done){
      findButWithFinalAfterExecLC(false)
      .tolerate(function(){ return ['how many', 'mashed potatoes', 'will it take??!']; })
      .exec(function (err, result) {
        if (err) { return done(err); }
        try {
          assert.deepEqual(result, ['how many', 'mashed potatoes', 'will it take??!', {fake: true}]);
        } catch (e) { return done(e); }
        return done();
      });
    });

  });//</ calling .find().tolerate() >

});
