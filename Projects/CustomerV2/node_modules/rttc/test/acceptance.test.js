var assert = require('assert');
var validate = require('../lib/validate');
var validateStrict = require('../lib/validate-strict');
var coerce = require('../lib/coerce');

describe('Acceptance: simple coercion, validation, and strict validation', function() {

  describe('.coerce()', function() {

    describe('to string', function() {
      it('should coerce undefined to base type', function() {
        assert.strictEqual(coerce('string', undefined), '');
      });
      it('should coerce to base type when it gets: null', function (){
        assert.strictEqual(coerce('string', null), '');
      });
      it('should coerce to base type when it gets: NaN', function (){
        assert.strictEqual(coerce('string', NaN), '');
      });
      it('should coerce to base type when it gets: Infinity', function (){
        assert.strictEqual(coerce('string', Infinity), '');
      });
      it('should coerce to base type when it gets: -Infinity', function (){
        assert.strictEqual(coerce('string', -Infinity), '');
      });
      it('should not touch arbitrary string', function() {
        assert.strictEqual(coerce('string', 'foo'), 'foo');
      });
      it('should not touch empty string', function() {
        assert.strictEqual(coerce('string', ''), '');
      });
      it('should not touch integerish string', function() {
        assert.strictEqual(coerce('string', '2382'), '2382');
      });
      it('should not touch negative integerish string', function() {
        assert.strictEqual(coerce('string', '-2382'), '-2382');
      });
      it('should not touch negative zeroish string', function() {
        assert.strictEqual(coerce('string', '0'), '0');
      });
      it('should not touch decimalish string', function() {
        assert.strictEqual(coerce('string', '1.325'), '1.325');
      });
      it('should not touch negative decimalish string', function() {
        assert.strictEqual(coerce('string', '-1.325'), '-1.325');
      });
      it('should coerce numbers to strings', function() {
        assert.strictEqual(coerce('string', 2382), '2382');
        assert.strictEqual(coerce('string', -2382), '-2382');
        assert.strictEqual(coerce('string', 0), '0');
        assert.strictEqual(coerce('string', 1.325), '1.325');
        assert.strictEqual(coerce('string', -1.325), '-1.325');
      });

    });

    describe('to number', function (){
      it('should coerce undefined to base type', function() {
        assert.strictEqual(coerce('number', undefined), 0);
      });
      it('should coerce to base type when it gets: null', function (){
        assert.strictEqual(coerce('number', null), 0);
      });
      it('should coerce to base type when it gets: NaN', function (){
        assert.strictEqual(coerce('number', NaN), 0);
      });
      it('should coerce to base type when it gets: Infinity', function (){
        assert.strictEqual(coerce('number', Infinity), 0);
      });
      it('should coerce to base type when it gets: -Infinity', function (){
        assert.strictEqual(coerce('number', -Infinity), 0);
      });
      it('should not touch positive integer', function (){
        assert.strictEqual(coerce('number', 3), 3);
      });
      it('should not touch negative integer', function (){
        assert.strictEqual(coerce('number', -3), -3);
      });
      it('should not touch negative decimal', function (){
        assert.strictEqual(coerce('number', -3.2), -3.2);
      });
      it('should not touch zero', function (){
        assert.strictEqual(coerce('number', 0), 0);
      });
      it('should coerce "3.25" to 3.25', function() {
        assert.strictEqual(coerce('number', '3.25'), 3.25);
      });
      it('should coerce "-3.25" to -3.25', function() {
        assert.strictEqual(coerce('number', '-3.25'), -3.25);
      });
      it('should coerce "0" to 0', function() {
        assert.strictEqual(coerce('number', '0'), 0);
      });
    });

    describe('to boolean', function (){
      it('should coerce undefined to base type', function() {
        assert.strictEqual(coerce('boolean', undefined), false);
      });
      it('should coerce to base type when it gets: null', function (){
        assert.strictEqual(coerce('boolean', null), false);
      });
      it('should coerce to base type when it gets: NaN', function (){
        assert.strictEqual(coerce('boolean', NaN), false);
      });
      it('should coerce to base type when it gets: Infinity', function (){
        assert.strictEqual(coerce('boolean', Infinity), false);
      });
      it('should coerce to base type when it gets: -Infinity', function (){
        assert.strictEqual(coerce('boolean', Infinity), false);
      });
      it('should not touch true', function() {
        assert.strictEqual(coerce('boolean', true), true);
      });
      it('should not touch false', function() {
        assert.strictEqual(coerce('boolean', false), false);
      });
      it('should coerce "true" to true', function() {
        assert.strictEqual(coerce('boolean', 'true'), true);
      });
      it('should coerce "false" to false', function() {
        assert.strictEqual(coerce('boolean', 'false'), false);
      });
    });

  });

  describe('.validateStrict()', function() {

    describe('to string', function() {
      it('should fail on null', function (){
        assert.throws(function (){
          validateStrict('string', null);
        });
      });
      it('should fail on NaN', function (){
        assert.throws(function (){
          validateStrict('string', NaN);
        });
      });
      it('should fail on Infinity', function (){
        assert.throws(function (){
          validateStrict('string', Infinity);
        });
      });
      it('should fail on -Infinity', function (){
        assert.throws(function (){
          validateStrict('string', -Infinity);
        });
      });
      it('should choke on `undefined`', function() {
        assert.throws(function (){
          validateStrict('string', undefined);
        });
      });
      it('should not touch arbitrary string', function() {
        assert.strictEqual(validate('string', 'foo'), 'foo');
      });
      it('should not touch empty string', function() {
        assert.strictEqual(validate('string', ''), '');
      });
      it('should not touch integerish string', function() {
        assert.strictEqual(validate('string', '2382'), '2382');
      });
      it('should not touch negative integerish string', function() {
        assert.strictEqual(validate('string', '-2382'), '-2382');
      });
      it('should not touch negative zeroish string', function() {
        assert.strictEqual(validate('string', '0'), '0');
      });
      it('should not touch decimalish string', function() {
        assert.strictEqual(validate('string', '1.325'), '1.325');
      });
      it('should not touch negative decimalish string', function() {
        assert.strictEqual(validate('string', '-1.325'), '-1.325');
      });
      it('should choke on numbers', function() {
        assert.throws(function (){
          validateStrict('string', undefined);
        });
        assert.throws(function (){
          validateStrict('string', 2382);
        });
        assert.throws(function (){
          validateStrict('string', -2382);
        });
        assert.throws(function (){
          validateStrict('string', 0);
        });
        assert.throws(function (){
          validateStrict('string', 1.325);
        });
        assert.throws(function (){
          validateStrict('string', -1.325);
        });
      });

    });

    describe('to number', function (){
      it('should fail on null', function (){
        assert.throws(function (){
          validateStrict('number', null);
        });
      });
      it('should fail on NaN', function (){
        assert.throws(function (){
          validateStrict('number', NaN);
        });
      });
      it('should fail on Infinity', function (){
        assert.throws(function (){
          validateStrict('number', Infinity);
        });
      });
      it('should fail on -Infinity', function (){
        assert.throws(function (){
          validateStrict('number', -Infinity);
        });
      });
      it('should choke on `undefined`', function() {
        assert.throws(function (){
          validateStrict('number', undefined);
        });
      });
      it('should not touch positive integer', function (){
        assert.strictEqual(validate('number', 3), 3);
      });
      it('should not touch negative integer', function (){
        assert.strictEqual(validate('number', -3), -3);
      });
      it('should not touch negative decimal', function (){
        assert.strictEqual(validate('number', -3.2), -3.2);
      });
      it('should not touch zero', function (){
        assert.strictEqual(validate('number', 0), 0);
      });
      it('should choke on "3.25"', function() {
        assert.throws(function(){
          validateStrict('number', '3.25');
        });
      });
      it('should choke on "-3.25"', function() {
        assert.throws(function(){
          validateStrict('number', '-3.25');
        });
      });
      it('should choke on "0"', function() {
        assert.throws(function(){
          validateStrict('number', '0');
        });
      });
    });

    describe('to boolean', function (){
      it('should fail on null', function (){
        assert.throws(function (){
          validateStrict('boolean', null);
        });
      });
      it('should fail on NaN', function (){
        assert.throws(function (){
          validateStrict('boolean', NaN);
        });
      });
      it('should fail on Infinity', function (){
        assert.throws(function (){
          validateStrict('boolean', Infinity);
        });
      });
      it('should fail on -Infinity', function (){
        assert.throws(function (){
          validateStrict('boolean', -Infinity);
        });
      });
      it('should choke on `undefined`', function() {
        assert.throws(function (){
          validateStrict('boolean', undefined);
        });
      });
      it('should not touch true', function() {
        assert.strictEqual(validate('boolean', true), true);
      });
      it('should not touch false', function() {
        assert.strictEqual(validate('boolean', false), false);
      });
      it('should choke on "true"', function() {
        assert.throws(function (){
          validateStrict('boolean', 'true');
        });
      });
      it('should choke on "false"', function() {
        assert.throws(function (){
          validateStrict('boolean', 'false');
        });
      });
    });

  });

});

