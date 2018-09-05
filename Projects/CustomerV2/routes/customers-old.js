var express = require('express');
var router = express.Router();

var logging = require('../lib/logging');
var return_codes = require('../resources/return_codes');

//let bo = require('/Users/donaldferguson/Dropbox/ColumbiaCourse/Courses/Fall2018/E6156/Projects/Customer/resources/customers/customersbo');

var moduleName="customers.";

router.get('/:id', function(req, res, next) {

    res.json({msg: "OK", id: req.params.id})

});

router.get('/', function(req, res, next) {

    res.json({msg: "OK", query: req.query})
});




/*
router.get('/:id', function(req, res, next) {
    var functionName="router.get:"

    //logging.debug_message(moduleName+functionName + "tenant  = ", req.tenant);
    //logging.debug_message(moduleName+functionName + "params  = ", req.params);

    // Extract the tenant from the HTTP header.
   // context = {tenant: req.tenant};

    try {
        if (req.query && req.query.fields) {
            fields = req.query.fields.split(',');
            delete req.query.fields;
        }
        else {
            fields = ['*']
        };

        bo.retrieveById(req.params.id, fields, context).then(
            function(result) {
                //logging.debug_message("bo.retrieveById: result = ", result);
                if (result) {
                    res.status(200).json(result);
                }
                else {
                    res.status(404).send("Not found!")
                }
            },
            function(error) {
                logging.debug_message("customers.get: error = " + error);
                if (error.code && error.code == return_codes.codes.invalid_query.code) {
                    res.status(400).send("You are a teapot.")
                }
                else {
                    res.status(500).send("Internal error.");
                }
            }
        );
    }
    catch( e) {
      logging.error_message("e = " + e);
      res.status(500).send("Boom!");
    }
});

router.get('/', function(req, res, next) {
    logging.debug_message("tenant  = ", req.tenant);
    logging.debug_message("params  = ", req.params);
    logging.debug_message("query  = ", req.query);

    context = {tenant: req.tenant};

    let fields = [];
    try {
        if (req.query && req.query.fields) {
            fields = req.query.fields.split(',');
            delete req.query.fields;
        }
        else {
            fields = ['*']
        };
        logging.debug_message('customers.get: query = ', req.query);

        bo.retrieveByTemplate(req.query, fields, context).then(
            function(result) {
                logging.debug_message("bo.retrieveById: result = ", result);
                if (result) {
                    res.status(200).json(result);
                }
                else {
                    res.status(404).send("Not found!")
                }
            },
            function(error) {
                if (error.code && error.code == return_codes.codes.invalid_query.code) {
                    res.status(400).send("You are a teapot.")
                }
                else {
                    res.status(500).send("Internal error.");
                }
            }
        );
    }
    catch( e) {
        logging.error_message("e = " + e);
        res.status(500).send("Boom!");
    }
});

*/

router.put('/:id', function(req, res, next) {
});

router.put('/', function(req, res, next) {
});

router.delete('/:id', function(req, res, next) {
});

router.delete('/', function(req, res, next) {
});





module.exports = router;
