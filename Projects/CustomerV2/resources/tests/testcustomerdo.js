/**
 * Created by donaldferguson on 8/26/18.
 */

const logging = require('/Users/donaldferguson/Dropbox/ColumbiaCourse/Courses/Fall2018/lib/logging');
const cdo =
    require('/Users/donaldferguson/Dropbox/ColumbiaCourse/Courses/Fall2018/E6156/Old/Customer/resources/customers/customersdo');

let theCdo = new cdo.CustomersDAO();

const testA = function() {
    theCdo.retrieveById('df1', ['lastName', 'email'], {tenant: 'E6156'}).then(
        function(result) {
            logging.debug_message("testA result = ", result);
        })
        .catch(
            function(error) {
                logging.error_message("testA error = " + error);
            });
};


testA();
