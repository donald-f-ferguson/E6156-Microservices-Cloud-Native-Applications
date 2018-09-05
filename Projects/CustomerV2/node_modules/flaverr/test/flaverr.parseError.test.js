describe('flaverr.parseError()', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){

  describe('given a normal Error instance', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return the same Error instance');
  });

  describe('given a bluebird/promise error thing', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return the internal, wrapped Error instance as expected');
  });

  describe('given a Stripe SDK error thing', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return the internal, wrapped Error instance as expected');
  });

});
