// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set region
AWS.config.update({region: 'us-east-1'});


let sendEvent = function(subject, msg) {

    let params = {
        Message: msg,
        TopicArn: 'arn:aws:sns:us-east-1:832720255830:ElasticBeanstalkNotifications-Environment-Customerinfo2-env-secure'
    };
    if (subject) {
        params.Subject = subject;
    }

    // Create promise and SNS service object
    let publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

    // Handle promise's fulfilled/rejected states
    publishTextPromise.then(
        function (data) {
            console.log(`Message ${params.Message} send sent to the topic ${params.TopicArn}`);
            console.log("MessageID is " + data.MessageId);
        }).catch(
        function (err) {
            console.error(err, err.stack);
        });
};

let startupNotification = function() {
// Create publish parameters

    //sendEvent('System started.', "Totally!");

};

let registrationNotification = function(d) {

    let msg = JSON.stringify(d);

    sendEvent("CustomerRegistration", msg);

}

exports .startupNotification = startupNotification;
exports .registrationNotification = registrationNotification;