describe('flaverr.getBareTrace()', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){

  describe('with `flaverr.getBareTrace(err)`', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should work');
    it('should return the provided error\'s trace');
  });

  describe('with `flaverr.getBareTrace()`', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should return a good trace from where it was invoked');
  });

  describe('with `flaverr.getBareTrace(caller)`', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should fail with an error message explaining about Error.captureStackTrace if the caller is an unrelated function not even from the current stack');
    it('should return a good trace from where the caller function was invoked in the current stack');
  });

});
