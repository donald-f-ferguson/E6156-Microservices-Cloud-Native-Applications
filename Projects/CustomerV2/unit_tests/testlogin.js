const loginbo = require('../resources/customers/login_register_bo');
const logging = require('../lib/logging');


context = { "tenant": "E6156"};

loginbo.login({ "email":"dd@duck.org", "pw": "ppp"}, context).then(
    function(result) {
        logging.debug_message("Result = ", result);
    }
);