describe('flaverr()', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){

  describe('overriding an existing Error\'s `.code`', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should work with `flaverr({code: \'…\'},err)`');
    it('should work with `flaverr(\'…\',err)`');
  });

  describe('adding/overriding other miscellaneous properties of an existing Error', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should work');
  });

  describe('constructing a new Error', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should work');
    it('should get expected customizations');
    it('should have `.name === \'Error\'` by default');
  });

  describe('overriding an existing Error\'s `.name`', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should work');
    it('should also impact the `.stack`');
  });

  describe('overriding an existing Error\'s `.message`', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should work');
    it('should also impact the `.stack`');
  });

  describe('attempting to set an Error\'s `.stack`', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should fail');
  });

  describe('using `flaverr(…,…,caller)` to improve the stack trace', function _wouldBeArrowFnIfDidntNeedToSupportNode6(){
    it('should work');
    it('should properly modify stack trace');
  });

});
