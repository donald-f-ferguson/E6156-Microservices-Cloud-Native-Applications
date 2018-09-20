/**
 * Created by donaldferguson on 8/12/18.
 */
let path_base = "/Users/donaldferguson/Dropbox/ColumbiaCourse/Courses/Fall2018/E6156/Projects/CustomerV2/";
let logging = require(path_base + "lib/logging");
let  mysql = require('mysql');

let con = mysql.createConnection({
    host: "columbiae6156.cqgsme1nmjms.us-east-1.rds.amazonaws.com",
    user: "dbuser2",
    password: "dbuser2"
});


con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

let sql = "select * from cloude6156.customers where customers_id = 'dv1';"

con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + JSON.stringify(result, null, 4));
});

for (let i = 0; i < 5; i++) {
    console.log("Hello: " + i);
}