
let env = {
    beanstalk: {
        host:  'aa9u927eqb935j.cqgsme1nmjms.us-east-1.rds.amazonaws.com',
        port: 3306,
        adapter: 'db',
        url: 'mysql://dbuser2:dbuser2@aa9u927eqb935j.cqgsme1nmjms.us-east-1.rds.amazonaws.com:3306/cloude6156'
    },
    local: {
        host:  '127.0.0.1',
        port: 3306,
        adapter: 'db',
        url: 'mysql://dbuser:dbuser@localhost:3306/E6156'
    }
};

exports.getEnv = function(n) {
    return env[n];
};
