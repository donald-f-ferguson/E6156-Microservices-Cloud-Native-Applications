
// As hoc logging function.
const logging = require('/Users/donaldferguson/Dropbox/ColumbiaCourse/Courses/Fall2018/lib/logging');

// Load the AWS SDK for Node.js
let AWS = require('aws-sdk');

// Load the AWS API Key from my local, private configuration file.
let credentials = new AWS.SharedIniFileCredentials({profile: 'columbia'});
// Set the credential.
AWS.config.credentials = credentials;
// Set the region
AWS.config.update(
    {region: 'us-east-1'});


const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();

logging.debug_message("DynamoDAO initialization complete.")

let Dao = function(config) {

    self = this;                                        // JavaScript "this" can act weird.

    self.config = config;                        // Configuration information.


    self.retrieveById = function(id, fields) {
        return new Promise(function(resolve, reject) {
            let params = {};
            params.Key = {[config.primaryKey] : id};
            params.TableName =  config.tableName;
            dynamo.getItem(params, function(err, result) {
                if (err) {
                    reject(err)
                }
                if (result) {
                    resolve(result);
                }
            });
        });
    };

    self.retrieveByTemplate = function(template, fields) {

    };

    self.update = function(template, fields) {

    };

    self.delete = function(template) {

    };

    self.create = function(data) {
        return new Promise(function(resolve, reject) {
            let params = {};
            params.Item = data;
            params.TableName =  config.tableName;
            dynamo.putItem(params, function(err, result) {
                if (err) {
                    reject(err)
                }
                if (result) {
                    resolve(result);
                }
            });
        });

    };

};



exports.Dao = Dao;