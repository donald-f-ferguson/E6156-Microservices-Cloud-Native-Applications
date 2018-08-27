/**
 * Created by donaldferguson on 8/11/18.
 */

var db = require('../../lib/db');
var logging = require('../../lib/logging');


var find_by_id = function(id) {

    return new Promise(function (resolve, reject) {
        db.execute_query("select * from e6165.customers where customers_id = ?", [id], null).then(
            function (result) {
                logging.debug_message("Result = ", result);
                resolve(result);
            },
            function (error) {
                logging.debug_error("Error = ", result);
                resolve(result);
            });
    });
};

var get_by_template = function(t) {
    var statement = "SELECT * from e6165.customers where ";
    keys = Object.keys(t);
    for (var i = 0; i < keys.length; i++) {
        statement += keys[i] += " = ? ";
        if (i < keys.length - 1) {
            statement += " and ";
        }
    };

    var values = Object.values(t);

    return new Promise(function (resolve, reject) {
        db.execute_query(statement, values, null).then(
            function (result) {
                logging.debug_message("Result = ", result);
                resolve(result);
            },
            function (error) {
                logging.debug_error("Error = ", result);
                resolve(result);
            });
    });

}

/*
find_by_id('df1').then(
    function(result) {
        logging.debug_message('Result = ', result)
    }
);
    */

get_by_template({customers_firstname: "Donald"}).then(
    function(result) {
        logging.debug_message('Result = ', result)
    });