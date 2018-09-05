/**
 * Created by donaldferguson on 8/16/18.
 */
// jshint node: true

// NPM packages for Waterline and connection to MySQL
let Waterline = require('waterline');
let dbAdaptor = require('sails-mysql');

// Simple utility packages that I use.
let logging = require('../../lib/logging');         // Should replace with Winston or similar.
let env = require('../../env');

// Ad hoc approach to getting information based on running local, beanstalk, etc.
let environment_name = process.env.eb2_environment;
logging.debug_message("environment_name = ", environment_name);
let db_info = env.getEnv(environment_name)
logging.debug_message("s_env = ", db_info);


// Standard Waterline initialization.
let waterline = new Waterline();

// Ontology is a high-falutin modeling term. In this context, it means
// "a set of concepts and categories in a subject area or domain that shows their properties and the
// "relations between them." Or, in other words, the tables, columns, keys, etc.
let ontology = null;


// This would get a little more complex in an environment with multiple different connections
// and backends.
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
    var wCollection = Waterline.Collection.extend(c);
    waterline.registerModel(wCollection);
};


// You need the Ontology to get the collection to perform an operation.
// This MAY talk to the DB engine and Waterline, and hence can go asynchronous.
let getOntology = function() {
    "use strict";
    return new Promise(function (resolve, reject) {
        if (ontology) {
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
let getByQ = function(id, q, fields) {
    return new Promise(function (resolve, reject) {
        getCollection(id).then(
            function (result) {
                resolve(result.find({"where": q, "select": fields}));
            },
            function (error) {
                reject(error)
            });
    });
};

let create = function(id, d) {
    return new Promise(function (resolve, reject) {
        getCollection(id).then(
            function (result) {
                resolve(result.create(d));
            },
            function (error) {
                reject(error)
            });
    });
};


let Dao = function(collection) {

    self = this;                                        // JavaScript "this" can act weird.

    self.collection = collection;                       // Configuration information.

    registerCollection(this.collection);                // Register config information with Waterline.

    self.retrieveById = function(id, fields) {
        return new Promise(function(resolve, reject) {
            s = self.collection.primaryKey;

            getByQ(self.collection.identity, {[s]: id}).then(
                function (result) {
                    if (result && result[0]) {
                        resolve(result[0])
                    }
                    else {
                        resolve([]);
                    }
                },
                function (error) {
                    logging.debug_message("Boom = " + error);
                    reject(error);
                }
            );
        });
    };

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

    self.create = function(data) {
        return new Promise(function(resolve, reject) {
            create(self.collection.identity, data).then(
                function (result) {
                    resolve(result)
                },
                function (error) {
                    logging.debug_message("Boom = " + error);
                    reject(error);
                }
            );
        });
    };

};



exports.Dao = Dao;


