var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("In index.");
  res.render('index',
      { title: 'First Microservice' ,
       msg: 'I hope this is awesome.'});
});

module.exports = router;
