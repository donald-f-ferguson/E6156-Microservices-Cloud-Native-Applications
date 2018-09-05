describe('flaverr.parseOrBuildError()', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){

  describe('given a normal Error instance', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return the same Error instance');
  });

  describe('given a bluebird/promise error thing', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return the internal, wrapped Error instance as expected');
  });

  describe('given a Stripe SDK error thing', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return the internal, wrapped Error instance as expected');
  });

  describe('given a miscellaneous string', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return an Error instance that uses that value as its message');
  });

  describe('given `\'\'` (empty string)', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return an Error instance that uses a reasonable, pretty-printed string representation of that value as its message');
  });

  describe('given `null`', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return an Error instance that uses a reasonable, pretty-printed string representation of that value as its message');
  });

  describe('given `undefined`', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return an Error instance that uses a reasonable, pretty-printed string representation of that value as its message');
  });

  describe('given a miscellaneous number', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return an Error instance that uses a reasonable, pretty-printed string representation of that value as its message');
  });

  describe('given Infinity', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return an Error instance that uses a reasonable, pretty-printed string representation of that value as its message');
  });

  describe('given NaN', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return an Error instance that uses a reasonable, pretty-printed string representation of that value as its message');
  });

  describe('given `0` (zero)', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return an Error instance that uses a reasonable, pretty-printed string representation of that value as its message');
  });

  describe('given `false`', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return an Error instance that uses a reasonable, pretty-printed string representation of that value as its message');
  });

  describe('given `true`', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return an Error instance that uses a reasonable, pretty-printed string representation of that value as its message');
  });

  describe('given a dictionary', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return an Error instance that uses a reasonable, pretty-printed string representation of that value as its message');
  });

  describe('given a array', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return an Error instance that uses a reasonable, pretty-printed string representation of that value as its message');
  });

  describe('given a function', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return an Error instance that uses a reasonable, pretty-printed string representation of that value as its message');
  });

  describe('given something truly evil (circular)', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return an Error instance that uses a reasonable, pretty-printed string representation of that value as its message');
  });

  describe('given a Buffer', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return an Error instance that uses a pretty-printed string representation of that value as its message');
  });

  describe('given a Stream', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return an Error instance that uses a pretty-printed string representation of that value as its message');
  });

});
