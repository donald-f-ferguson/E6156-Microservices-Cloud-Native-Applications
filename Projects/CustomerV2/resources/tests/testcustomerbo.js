/**
 * Created by donaldferguson on 8/27/18.
 */

const logging = require('/Users/donaldferguson/Dropbox/ColumbiaCourse/Courses/Fall2018/lib/logging');
const cbo =
    require('/Users/donaldferguson/Dropbox/ColumbiaCourse/Courses/Fall2018/E6156/Old/Customer/resources/customers/customersbo');

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
testB1();

