
// As hoc logging function.
let logging = require('/Users/donaldferguson/Dropbox/ColumbiaCourse/Courses/Fall2018/lib/logging');

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

logging.debug_message("Initialization complete.")

let callDone = function(err, result) {
    if (err) {
        logging.error_message("Error = " + err);
    }
    if (result) {
        logging.debug_message("Result = ", result);
    }
};

result = dynamo.scan({ TableName: "ContactInfo" }, callDone);

let CustomersDAO = function() {

    // Make a DAO and initialize with the collection metadata.
    this.theDao = new Dao.Dao(customersCollection);

    let self = this;

    this.retrieveById = function(id,  fields, context) {
        template = {[customersCollection.primaryKey]: id, "tenant_id": context.tenant};
        return self.theDao.retrieveByTemplate(template, fields).then(
            function (result) {
                result = convertToDate(result[0]);
                //logging.debug_message("Result = ", result);
                return result;
            }
        ).catch(function(error) {
            logging.debug_message("PeopleDAO.retrieveById: error = ", error);
        });
    };

    this.retrieveByTemplate = function(tmpl, fields, context) {
        tmpl.tenant_id = context.tenant;
        return self.theDao.retrieveByTemplate(tmpl, fields).then(
            function(result) {
                result = result.map(convertToDate);
                logging.debug_message("Result = ", result);
                return result;
            }
        ).catch(function(error) {
            logging.debug_message("PeopleDAO.retrieveByTemplate: error = ", error);
        });
    };

    self.update = function(template, fields) {

    };

    self.delete = function(template) {

    };
}


exports.CustomersDAO = CustomersDAO;