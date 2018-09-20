let express = require('express');

let logging = require('../lib/logging');
let return_codes = require('../resources/return_codes');
let bo = require('../resources/customers/customersbo');
let login_registration = require('../resources/customers/login_register_bo');

let moduleName="customers.";

/*
    The application is independent of the web interface. Local code might call the application logic and there
    may be other channels (pub/sub, text, message queues, ...) for driving the logic. This module, and this method,
    adapt between the general application errors and web specific responses.

    This code applies to all resources and routes and should be external to the handler for any
    specific resource type.

 */
let map_response = function(e, res) {


    let mapped_error = {};

    switch(e.code) {

        case return_codes.codes.uniqueness_violation.code: {
            res.status(409).json("Duplicate data.");
            break;
        }

        case return_codes.codes.registration_success.code: {

            // POST is "creating" something. We will return
            // 201 -- created.
            // A link to the thing created. This should probably be in a links header..
            e.resource="customers";
            let url = "/" + e.resource + "/" + e.id;
            let links = [];
            links.push({rel: "self", href: url});
            let result = { msg: "Created", links: links };

            // If there is a generated security token, return it.
            if (e.token) {
                res.set("Authorization", e.token);
            }

            res.status(201).json(result);
            break;
        }

        // Basically, same logic as above but for login, which is also a POST.
        case return_codes.codes.login_success.code: {
            e.resource="customers";
            let url = "/" + e.resource + "/" + e.id;
            let links = [];
            links.push({rel: "self", href: url});
            let result = { msg: "Created", links: links };
            res.set("Authorization", e.token);
            res.status(201).json(result);
            break;
        }

        // There are MANY other error codes we need to handle.
        default: {
            res.status(500).json("Why is it always me?");
            break;
        }

    }

    return mapped_error;

};

// This function and login should probably be in separate route handlers, but I am lazy.
// You have probably noticed this by now.
let register = function(req, res, next) {
    let functionName="register:"

    let data = req.body;

    // I will explain the tenant stuff later.
    let context = {tenant: req.tenant};

    logging.debug_message(moduleName+functionName + "tenant  = ", req.tenant);
    logging.debug_message(moduleName+functionName + "body  = ", data);


    login_registration.register(data, context).then(
        function(result) {
            if (result) {
               map_response(result, res);
            }
            else {
                reject(return_codes.codes.internal_error);
            }
        },
        function(error) {
            logging.error_message(moduleName+functionName + " error = ", error);
            map_response(error, res);
        }
    );
};

let login = function(req, res, next) {
    let functionName="login:"

    let data = req.body;
    let context = {tenant: req.tenant};

    logging.debug_message(moduleName+functionName + "tenant  = ", req.tenant);
    logging.debug_message(moduleName+functionName + "body  = ", data);


    login_registration.login(data, context).then(
        function(result) {
            if (result) {
                map_response(result, res);
            }
            else {
                reject(return_codes.codes.internal_error);
            }
        },
        function(error) {
            logging.error_message(moduleName+functionName + " error = ", error);
            map_response(error, res);
        }
    );
};

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
            logging.error_message(moduleName+functionName + " error = ", error);
            map_response(error, res);
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
exports.register = register;
exports.login = login;

/*
router.put('/:id', function(req, res, next) {
});


router.delete('/:id', function(req, res, next) {
});

router.delete('/', function(req, res, next) {
});
*/






