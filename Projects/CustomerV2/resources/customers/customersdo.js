

let logging = require('../../lib/logging');
let Dao = require('../dao');
let sandh = require('../../lib/salthash');


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

// This kind of stinks. Waterline does not support TIMESTAMP and other MySQL data types.
let convertToDate = function(r) {
    if (r != null) {
        if (r.created) {
            r.created = new Date(r.created);
        };
        if (r.modified) {
            r.modified = new Date(r.modified);
        };
        if (r.last_login) {
            r.last_login = new Date(r.last_login);
        }
    };
    return r;
};

// This kind of stinks. Waterline does not support TIMESTAMP and other MySQL data types.
let convertFromDate = function(r) {
    if (r != null) {
        if (r.created) {
            r.create = r.created.getTime();
        };
        if (r.modified) {
            r.modified = r.modified.getTime();
        };
        if (r.last_login) {
            r.last_login = r.last_login.getTime();
        }
    }
    return r;
};


let CustomersDAO = function() {

    // Make a DAO and initialize with the collection metadata.
    this.theDao = new Dao.Dao(customersCollection);

    let self = this;

    this.retrieveById = function(id,  fields, context) {

        // This is where we introduce multi-tenancy for data access.
        // We could have done in generic DAO but I wanted that to be focused just on Sails, Waterline and RDB.
        //
        // Convert and ID lookup to a template look up and add tenant_id from the context.
        let template = {[customersCollection.primaryKey]: id, "tenant_id": context.tenant,
            status: {"!=": "DELETED"}};


        return self.theDao.retrieveByTemplate(template, fields).then(
            function (result) {
                result = convertToDate(result[0]);                  //  Need to convert numeric dates to Date();
                //logging.debug_message("Result = ", result);
                return result;
            }
        ).catch(function(error) {
            logging.debug_message("PeopleDAO.retrieveById: error = ", error);
        });
    };

    // Basically the same logic.
    this.retrieveByTemplate = function(tmpl, fields, context) {

        // Add tenant_id to template.
        tmpl.tenant_id = context.tenant;

        if (!tmpl.status) {
            tmpl.status = {"!=": "DELETED"}
        }

        return self.theDao.retrieveByTemplate(tmpl, fields).then(
            function(result) {
                result = result.map(convertToDate);
                return result;
            }
        ).catch(function(error) {
            logging.debug_message("PeopleDAO.retrieveByTemplate: error = ", error);
        });
    };

    this.create = function(data, context) {

        return new Promise(function (resolve, reject) {
            // Add tenant_id to template.
            data.tenant_id = context.tenant;

            // Need to do two things here.
            // 1. Convert JavaScript dates to timestamps.
            // 2. Hash/Salt the password.

            // Set created and modified.
            data.created = new Date();
            data.modified = new Date();

            // This is kind of a hack.
            data.last_login = new Date(0);

            data = convertToDate(data);

            // DO NOT STORE UNENCRYPTED PWs.
            data.pw = sandh.saltAndHash(data.pw);

            // NOTE: Business layer determines if the created customer's state is PENDING.
            // "Customer" may be an admin or being created manually through some admin tasl.


            self.theDao.create(data).then(
                function (result) {
                    if (result === undefined || result == null) {
                        result = {}
                    }
                    resolve(result);
                },
                function(error) {
                    logging.error_message("customersdo.create: Error = ", error);
                    reject(error);
                })
                .catch(function(exc) {
                    logging.error_message("customersdo.create: Exception = " + exc);
                    reject(exc);
                });
        });
    };

    // TODO: Need to figure out how to handle return codes, e.g. not found.
    // Will have to get row_count or do a findByTemplateFirst.
    self.update = function(template, fields, context) {

        return new Promise(function (resolve, reject) {
            // Add tenant_id to template.

            template.tenant_id = context.tenant;
            template.status = {"!=": "DELETED"}

            self.theDao.update(template, fields).then(
                function (result) {
                    if (result === undefined || result == null) {
                        result = {}
                    }
                    resolve({});
                },
                function(error) {
                    logging.error_message("customersdo.update: Error = ", error);
                    reject(error);
                })
                .catch(function(exc) {
                    logging.error_message("customersdo.update: Exception = " + exc);
                    reject(exc);
                });
        });

    };

    // TODO: Need to figure out how to handle return codes, e.g. not found.
    // Will have to get row_count or do a findByTemplateFirst.
    self.delete = function(template, context) {

        return new Promise(function (resolve, reject) {
            // Add tenant_id to template.
            template.tenant_id = context.tenant;

            let data = { status: "DELETED"};

            self.update(template, data, context).then(
                function (result) {
                    if (result === undefined || result == null) {
                        result = {}
                    }
                    resolve({})
                },
                function(error) {
                    logging.error_message("customersdo.delete: Error = ", error);
                    reject(error);
                })
                .catch(function(exc) {
                    logging.error_message("customersdo.delete: Exception = " + exc);
                    reject(exc);
                });
        });

    };

    // Custom function. Counts number of IDs matching a prefix.
    self.count_ids = function(prefix) {
        reject("Not implemented.");
    }
}


exports.CustomersDAO = CustomersDAO;