let dao = require('./dynamodoa');

// As hoc logging function.
const logging = require('/Users/donaldferguson/Dropbox/ColumbiaCourse/Courses/Fall2018/lib/logging');

theDao =  new dao.Dao({ primaryKey: "customerId", tableName: "ContactInfo"});

/*
theDao.retrieveById("123").then(
    function(result) {
        logging.debug_message("Result = ", result);
    }
);
*/

let d = {
    customerId: "456",
    notes:
    [
        {
            date: JSON.stringify(new Date()),
            agent: "dff9",
            contactType: "phone",
            notes: ["What a jerk."]
        }
    ]
};

theDao.create(d).then(
    function(result) {
        logging.debug_message("Result = ", result);
    },
    function(err) {
        logging.error_message("Error = " + err);
    }
);