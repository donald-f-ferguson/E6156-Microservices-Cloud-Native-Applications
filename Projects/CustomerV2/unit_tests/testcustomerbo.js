/**
 * Created by donaldferguson on 8/27/18.
 */

const logging = require('../lib/logging');
const cbo = require('../resources/customers/customersbo');

let context = { tenant: "E6156"};

let testB1 = function() {
    cbo.retrieveById('df1', ['lastName', 'firstName', 'email'], context).then(
        function(result) {
            logging.debug_message("result = ", result);
        })
        .catch(
            function(error) {
                logging.error_message("error = " + error);
            }
        );
};

let test_create = {
    lastName: "Luis",
    firstName: 'Suarez',
    email: 'luis@fcp.es',
    status: 'PENDING',
    pw: "cool"
};

let testB2 = function(d) {
    cbo.create(d, context).then(
        function(result) {
            logging.debug_message("result = ", result);
        })
        .catch(
            function(error) {
                logging.error_message("error = " + error);
            }
        );
};

//testB1();
testB2(test_create);

