/**
 * Created by donaldferguson on 8/27/18.
 */

const logging = require('/Users/donaldferguson/Dropbox/ColumbiaCourse/Courses/Fall2018/lib/logging');
const Dao =
    require('/Users/donaldferguson/Dropbox/ColumbiaCourse/Courses/Fall2018/E6156/Old/Customer/resources/customers/dao');

// Metadata that defines the collection.
let customersCollection = {
    identity: 'customers',
    datastore: 'default',
    primaryKey: 'id',

    attributes: {
        id: {type: 'string', required: true, columnName: 'customers_id'},
        lastName: {type: 'string', required: true, columnName: "customers_lastname"},
        firstName: {type: 'string', required: true, columnName: "customers_firstname"},
        email: {type: 'string', required: true, columnName: "customers_email"},
        status: {type: 'string', required: true, columnName: 'customers_status'},
        pw: {type: 'string', required: true, columnName: 'customers_password'},
        last_login: {type: 'number', required: true, columnName: 'customers_last_login'},
        created: {type: 'number', required: true, columnName: 'customers_created'},
        modified: {type: 'number', required: true, columnName: 'customers_modified'},
        tenant_id: {type: 'string', required: true, columnName: 'tenant_id'}
    }
};

let testDao = new Dao.Dao(customersCollection);

const test1 = function() {
    testDao.retrieveById('df1').then(
        function(rows) {
            logging.debug_message("Test 1 results = ", rows);
        })
        .catch(
            function(error) {
                logging.error_message("Test 1 error = ", error);
            });
};

//test1();

const test2 = function() {
    testDao.retrieveByTemplate({ "lastName" : "Ferguson"}, ['lastName', 'firstName', 'email']).then(
        function(rows) {
            logging.debug_message("Test 2 results = ", rows);
        })
        .catch(
            function(error) {
                logging.error_message("Test 2 error = ", error);
            });
};
//test2();

const test4 = function() {
    data = {
        id: "df1",
        lastName: "Smith",
        firstName: "John",
        email: "js@cc.org",
        tenant_id: "E6156",
        status: "PENDING",
        pw: "TBD",
        last_login: 1,
        modified: 2,
        created: 3
    };
    testDao.create(data).then(
        function(rows) {
            logging.debug_message("Test 4 results = " + rows);
        })
        .catch(
            function(error) {
                logging.error_message("Test 4 error = " + error);
            });
};
test4();
