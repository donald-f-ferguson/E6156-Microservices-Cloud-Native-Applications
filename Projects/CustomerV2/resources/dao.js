/**
 * Created by donaldferguson on 8/16/18.
 */
// jshint node: true

// NPM packages for Waterline and connection to MySQL
// Waterline is an ORM package that comes with Sails.
// Sails is at https://sailsjs.com/
let Waterline = require('waterline');
// This is the adaptor for sails to MySQL: https://www.npmjs.com/package/sails-mysql
let dbAdaptor = require('sails-mysql');

// Simple utility packages that I use.
let logging = require('../lib/logging');         // Should replace with Winston or similar.
let env = require('../env');                     // Simple config info based on an environment variable.
let return_codes = require('./return_codes');      // Application standardized RCs.

// Ad hoc approach to getting information based on running local, beanstalk, etc.
// eb2_environment is the name of the environment variable.
let environment_name = process.env.eb2_environment;
logging.debug_message("environment_name = ", environment_name);

// Use the environment variable to get the information about DB conn based on environment.
let db_info = env.getEnv(environment_name)
logging.debug_message("s_env = ", db_info);


// Standard Waterline initialization.
let waterline = new Waterline();

// Ontology is a high-falutin modeling term. In this context, it means
// "a set of concepts and categories in a subject area or domain that shows their properties and the
// "relations between them." Or, in other words, the tables, columns, keys, etc.
let ontology = null;


// This would get a little more complex in an environment with multiple different connections
// and back-ends.
//
// This is a Waterline configuration structure. You define the adaptors, e.g. for MySQL or other DBs.
// You then define the various datastores (specific instances), addresses and adaptors.
let global_config = {
    adapters: {
        'db': dbAdaptor
    },
    datastores: {
        default: {
            host: db_info.host,
            port: db_info.port,
            adapter: 'db',
            url: db_info.url
        }
    }
};


// A collection is how Waterline says "Table."
// We are registering the metadata on the table.
let registerCollection = function(c) {
    let wCollection = Waterline.Collection.extend(c);
    waterline.registerModel(wCollection);
};


// You need the Ontology to get the collection to perform an operation.
// This MAY talk to the DB engine and Waterline, and hence can go asynchronous.
// Ontology is an off word to use.
//
let getOntology = function() {
    "use strict";                                           // Not sure how important this "strict" stuff is.
    return new Promise(function (resolve, reject) {
        if (ontology) {                                     // Have I retrieved and cached the ontology?
            //logging.debug_message("getOntology1: " + ontology);
            resolve(ontology);
        }
        else {
            // Ontology uses callbacks. Call initialize and resolve Promise based on the response.
            waterline.initialize(global_config, function (err, result) {
                if (err) {
                    logging.error_message("Error =", err);
                    reject(err);
                }
                else {
                    //logging.debug_message("Setting ontology = ", null);
                    ontology = result;
                    resolve(ontology);
                }
            });
        }
    });
};

// Given the name (identity) of a collection that represents a table, return it.
// This may go asynch.
//
//  Note: I could have put these functions inside the DAO class. I just write  standalone while trying to
// figure out Waterline and was too lazy to redo.
let getCollection =   function(id) {

    return new Promise(function(resolve, reject) {
        getOntology(global_config).then(
            function (result) {
                "use strict";
                //console.log("Collection identity = " + id);
                resolve(result.collections[id]);
            },
            function (err) {
                "use strict";
                logging.error_message("Error = " + err);
                reject(err);
            });
    });
};

// getByQ, create, etc. could really be in the Dao but what the heck.
// I tested them externally, independently. If it ain't broke, do not fix it.
//
// 1. id is the identity of the collection, aka database table.
// 2. q is a Waterline format of a query, which is primarily a dictionary of column names and values to match.
// 3. fields is the list of fields, e.g. project, to return.
//
let getByQ = function(id, q, fields) {
    return new Promise(function (resolve, reject) {
        getCollection(id).then(
            function (result) {
                if (fields) {
                    //
                    resolve(result.find({"where": q, "select": fields}));
                }
                else {
                    resolve(result.find({"where": q}));
                }
            },
            function (error) {
                reject(error)
            });
    });
};

// 1. id is the table name.
// 2. d is the dictionary of (column_name, value) pairs to insert.
//
let create = function(id, d) {
    return new Promise(function (resolve, reject) {
        getCollection(id).then(
            function (result) {
                resolve(result.create(d));
            },
            function (error) {
                reject(error)
            })
            .catch(function(exc) {
                logging.debug_message("exc = " + exc);
                reject(exc);
            });
    });
};


// I want to isolate high layer, external code from the fact that the underlying DB is MySQL.
// This module maps MySQL specific error codes to a generic set that all DAOs will implement,
// independently of the underlying database engine.
//
// Obviously, I have not rigorously figured out the DAO exceptions, the MySQL errors and the mapping.
// But, you get the idea.
//
let mapError = function(e) {

    let mapped_error = {};

    switch(e.code) {

        case "E_UNIQUE": {
            mapped_error = return_codes.codes.uniqueness_violation;
            break;
        }

        default: {
            mapped_error = return_codes.codes.unknown_error;
            break;
        }

    }

    return mapped_error;
};


// Generic class for accessing a table in MySQL.
let Dao = function(collection) {

    self = this;                                        // JavaScript "this" can act weird.

    self.collection = collection;                       // Configuration information.

    registerCollection(this.collection);                // Register config information with Waterline.

    // Retrieve by a single column, primary key.
    // Probably should add support for multi-column primary keys.
    self.retrieveById = function(id, fields) {
        return new Promise(function(resolve, reject) {
            s = self.collection.primaryKey;

            getByQ(self.collection.identity, {[s]: id}).then(
                function (result) {
                    if (result && result[0]) {
                        // Queries always return an array, but primary key is unique.
                        resolve(result[0])
                    }
                    else {
                        // This is a mistake. [] is the correct answer for general queries, but
                        // should be "not found" for a primary key lookup.
                        resolve([]);
                    }
                },
                function (error) {
                    logging.debug_message("Dao.retrieve_by_id: error  = " + error);
                    reject(error);
                }
            );
        });
    };

    // A template is a dictionary of the form (column_name: values). This function returns
    // all of the rows that match the template.
    //
    // TODO: Add support for pagination!
    //
    self.retrieveByTemplate = function(template, fields) {
        s = self.collection.primaryKey;
        return new Promise(function(resolve, reject) {
            getByQ(self.collection.identity, template, fields).then(
                function (result) {
                    if (result) {
                        resolve(result);
                    }
                    else {
                        resolve([]);
                    }
                },
                function (error) {
                    logging.debug_message("Boom2 = " + error);
                    reject(error);
                }
            )
        });
    };

    // I have not really tested this one all that much.
    self.update = function(template, updates) {

        return new Promise(function (resolve, reject) {
            getCollection(self.collection.identity).then(
                function (result) {
                    result.update(template, updates).then(
                        function (result) {
                            resolve(result);
                        },
                        function (error) {
                            logging.error_message("dao.Dao.update: error = ", error);
                            reject(error);
                        });
                },
                function (error) {
                    logging.error_message("dao.Dao.update: error = ", error);
                    reject(error)
                });
        });
    };

    // Ditto.
    self.delete = function(template) {
        return new Promise(function (resolve, reject) {
            getCollection(self.collection.identity).then(
                function (result) {
                    result.destroy(template).then(
                        function (result) {
                            resolve(result);
                        },
                        function (error) {
                            logging.error_message("dao.Dao.delete: error = ", error);
                            reject(error);
                        });
                },
                function (error) {
                    logging.error_message("dao.Dao.update: delete = ", error);
                    reject(error)
                });
        });
    };

    // Ditto
    self.create = function(data) {
        return new Promise(function(resolve, reject) {
            create(self.collection.identity, data).then(
                function (result) {
                    resolve(result)
                },
                function (error) {
                    let new_error = mapError(error);
                    logging.debug_message("Boom = ", new_error);
                    reject(new_error);
                }
            );
        });
    };

    // This would push a custom query into the DB, but Waterline makes this really hard.
    self.customQ = function(q) {
       reject("Not implemented.");
    };

};



exports.Dao = Dao;


