/**
 * Created by donaldferguson on 8/26/18.
 */

// jshint node: true

// Initialize and get a copy of the DO to support this BO.
const cdo = require('./customersdo');
let customersdo = new cdo.CustomersDAO();

let logging = require('../../lib/logging');
let return_codes =  require('../return_codes');                     // Come standard return codes for the app.
let moduleName = "customersbo.";                                    // Sort of used in logging messages.


// Do something clever to generate IDs that people can remember.
// This does not count as clever.
//
// REPLACED WITH A TRIGGER. COULD NOT DO PROPERLY WITH WATERLINE
// COULD NOT GET CUSTOM QUERY TO WORK.
let generateId = function(lastName, firstName) {

    throw new UserException("Unimplemented internal function generateID.");

    let p1 = firstName.substr(0,2);
    let p2 = lastName.substr(0,2);
    let p3 = String(Math.floor(Math.random() * 100));
    let newId = p1 + p2 + p3;
    return newId;
};


// Business logic may dictate that not all parameters are queryable.
// This should probably be part of a configurable framework that all BOs and use.
let validQParams = ['lastName', 'firstName', 'email', 'status'];
let validateQueryParameters = function(template, context) {


    // We would ONLY filter  values if this is not an internal, admin request.
    if (context.adminOperation) {
        return true;
    };

    let keys = Object.keys(template);
    for (let i = 0; i < keys.length; i++) {
        let pos = validQParams.indexOf(keys[i]);
        if (pos == -1) {
            return false;
        }
    }
    return true;
};

// Same idea for checking create information.
// Not really implemented
let validateCreateData = function(data) {
    // I feel lucky.
    return true;
};

// Same idea for checking update information.
// Not really implemented
let validateUpdateData = function(data) {
    // I feel lucky.
    return true;
};

// Fields to return from queries from non-admins.
// All of this needs to be in a reusable framework, otherwise I will repeat functions in every BO.
let fields_to_return = ['id', 'lastName', 'firstName', 'email', 'last_login', 'created'];
let filter_response_fields = function (result, context) {

    // We would ONLY filter return values if this is not an internal, admin request.
    if (context.adminOperation) {
        return result;
    }

    let new_result = null;
    if (result != null) {
        new_result = {};
        for (let i=0; i < fields_to_return.length; i++) {
            let n = fields_to_return[i];
            new_result[n] = result[n];
        }
    }
    return new_result;
};



// I did not do this as a JavaScript "class." No particular reason.
exports.retrieveById = function(id, fields, context) {
    let functionName = "retrieveById:";

    return new Promise(function (resolve, reject) {

        customersdo.retrieveById(id, fields, context).then(
            function (result) {
                //logging.debug_message(moduleName + functionName + "Result = ", result);
                result = filter_response_fields(result, context);
                resolve(result);
            },
            function (error) {
                logging.error_message(moduleName + functionName + "error = ", error);
                reject(return_codes.codes.internal_error);
            }
        )
    });
};

exports.retrieveByTemplate = function(template, fields, context) {
    let functionName = "retrieveByTemplate";


    let the_context = context;

    return new Promise(function (resolve, reject) {

        if (validateQueryParameters(template, the_context) == false) {
            reject(return_codes.codes.invalid_query);
        }
        else {
            customersdo.retrieveByTemplate(template, fields, context).then(
                function (result) {
                    //logging.debug_message(moduleName + functionName + "Result = ", result);
                    result = result.map(function(stuff) {
                        return filter_response_fields(stuff, the_context);
                    });
                    resolve(result);
                },
                function (error) {
                    logging.error_message(moduleName + functionName + "error = ", error);
                    reject(return_codes.codes.internal_error);
                }
            );
        }

    });
};

exports.create = function(data, context) {
    let functionName = "create";

    return new Promise(function (resolve, reject) {

        // Lucky guess?
        // Removed with a trigger
        //data.id = generateId(data.lastName, data.firstName);
        // This is going to get set in the database.
        data.id = "XXXXX";

        data.status = "PENDING"; // Until confirmation is always PENDING.

        let email = data.email;

        if (validateCreateData(data) == false) {
            reject(return_codes.codes.invalid_create_data);
        }
        else {
            customersdo.create(data, context).then(
                function (result) {
                    //logging.debug_message(moduleName + functionName + "Result = ", result);
                    /*
                    This part is due to the fact that I cannot get Waterline to run custom queries.
                    Need to find the ID. Relying on the fact that the email is unique.
                     */
                    exports.retrieveByTemplate({email: email}, null, context).then(
                        function(result) {
                            resolve({id: result[0].id});
                        },
                        function(error) {
                            logging.error_message(moduleName + functionName + "error trying to get ID  = ", error);
                        }
                    );
                },
                function (error) {
                    logging.error_message(moduleName + functionName + "error = ", error);
                    reject(error);
                }
            );
        }

    });
};


exports.delete = function(template, context) {
    // Should do business logic and possible wrap/map errors.
    // Getting lazy.
    return customersdo.delete(template, context);

};

exports.update = function(template, fields, context) {
    // Should do business logic and possible wrap/map errors.
    // Getting lazy.
    if (validateUpdateData(data)) {
        return customersdo.delete(template, context);
    }
    else {
        Promise.reject(return_codes.codes.invalid_update_datainvalid_update);
    }
};
