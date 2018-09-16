/**
 * Created by donaldferguson on 8/27/18.
 */

const logging = require('../lib/logging');
const Dao = require('./dao');



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



const test4 = function() {
    let data = {
        id: "js1",
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
                logging.error_message("Test 4 error = ", error);
            });
};

const test5 = function() {
    let data = {
        firstName: "Angus",
        email: "none",
        status: "ACTIVE",
    };
    testDao.update({ id: 'rf1' }, data).then(
        function(rows) {
            logging.debug_message("Test 5 results = " + rows);
        })
        .catch(
            function(error) {
                logging.error_message("Test 5 error = " + error);
            });
};

const test6= function() {
    let tmp = {
        firstName: "Angus",
        email: "none",
    };
    testDao.delete(tmp).then(
        function(rows) {
            logging.debug_message("Test 6 results = " + rows);
        })
        .catch(
            function(error) {
                logging.error_message("Test 6 error = " + error);
            });
};

const test8= function() {

    q = "SELECT count(*) where customers_id like 'Do%'";
    testDao.customQ(q).then(
        function(rows) {
            logging.debug_message("Test 8 results = " + rows);
        })
        .catch(
            function(error) {
                logging.error_message("Test 9 error = " + error);
            });
};

const test7= function() {
    let tmp = {
        firstName: "Donald"
    };
    let fields = { status: "ACTIVE"}
    testDao.update(tmp, fields).then(
        function(rows) {
            logging.debug_message("Test 7 results = " + rows);
        })
        .catch(
            function(error) {
                logging.error_message("Test 7 error = " + error);
            });
};

//test2();
//test4();
//test5();
//test6();
//test7()
test8();
