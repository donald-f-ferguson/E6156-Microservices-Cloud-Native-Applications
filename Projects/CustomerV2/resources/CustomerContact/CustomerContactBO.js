
// jshint node: true
//

console.log('Loading function');

const  AWS = require('aws-sdk');
const doc = require('dynamodb-doc');

let credentials = new AWS.SharedIniFileCredentials({profile: 'columbia'});
AWS.config.credentials = credentials;
// Set the region
AWS.config.update(
    {region: 'us-east-1'});

const dynamo = new doc.DynamoDB();

const done = function(err, result) {
    console.log("err = " + err);
    console.log("result = " + result);
}

console.log("creds = " + JSON.stringify(creds, null, 4));

result = dynamo.scan({ TableName: "ContactInfo" }, done);

exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    switch (event.httpMethod) {
        case 'DELETE':
            dynamo.deleteItem(JSON.parse(event.body), done);
            break;
        case 'GET':
            //dynamo.scan({ TableName: event.queryStringParameters.TableName }, done);
            let result = { msg: "Dude!" };
            done(null, result);
            break;
        case 'POST':
            dynamo.putItem(JSON.parse(event.body), done);
            break;
        case 'PUT':
            dynamo.updateItem(JSON.parse(event.body), done);
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};
