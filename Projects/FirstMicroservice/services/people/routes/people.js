var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("In people.");
  res.render('people',
      { email: 'dff9@columbia.edu' ,
       lname: 'Ferguson'});
});

module.exports = router;
