let express = require('express');

let logging = require('../lib/logging');
let return_codes = require('../resources/return_codes');
let bo = require('../resources/customers/customersbo');

let moduleName="customers.";


let post = function(req, res, next) {

    let functionName="post:"

    let data = req.body;
    let context = {tenant: req.tenant};

    logging.debug_message(moduleName+functionName + "tenant  = ", req.tenant);
    logging.debug_message(moduleName+functionName + "body  = ", data);


    bo.create(data, context).then(
        function(result) {
            if (result) {
                // !!!!!!!
                // Need to get ID to form URL.
                res.status(201).json(result);
            }
        },
        function(error) {
            logging.debug_message(moduleName+functionName + " error = " + error);
            if (error.code && error.code == return_codes.codes.invalid_query.code) {
                res.status(400).send("You are a teapot.")
            }
            else {
                res.status(500).send("Internal error.");
            }
        }
    );

};


let get_by_id = function(req, res, next) {


    let functionName="get_by_id:"

    logging.debug_message(moduleName+functionName + "tenant  = ", req.tenant);
    logging.debug_message(moduleName+functionName + "params  = ", req.params);

    // Extract the tenant from the HTTP header.
    let context = {tenant: req.tenant};
    let fields = null;

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

};

let get_by_query =  function(req, res, next) {

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
        }
        ;
        logging.debug_message('customers.get: query = ', req.query);

        bo.retrieveByTemplate(req.query, fields, context).then(
            function (result) {
                logging.debug_message("bo.retrieveById: result = ", result);
                if (result) {
                    res.status(200).json(result);
                }
                else {
                    res.status(404).send("Not found!")
                }
            },
            function (error) {
                if (error.code && error.code == return_codes.codes.invalid_query.code) {
                    res.status(400).send("You are a teapot.")
                }
                else {
                    res.status(500).send("Internal error.");
                }
            }
        );
    }
    catch (e) {
        logging.error_message("e = " + e);
        res.status(500).send("Boom!");
    }
};

exports.get_by_id = get_by_id;
exports.get_by_query = get_by_query;
exports.post = post;

/*
router.put('/:id', function(req, res, next) {
});

router.put('/', function(req, res, next) {
});

router.delete('/:id', function(req, res, next) {
});

router.delete('/', function(req, res, next) {
});
*/






