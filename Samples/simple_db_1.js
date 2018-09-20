/**
 * Created by donaldferguson on 8/12/18.
 */
let path_base = "/Users/donaldferguson/Dropbox/ColumbiaCourse/Courses/Fall2018/E6156/Projects/CustomerV2/";
let logging = require(path_base + "lib/logging");
let  mysql = require('mysql');

let con = mysql.createConnection({
    host: "localhost",
    user: "dbuser",
    password: "dbuser"
});


con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

let sql = "select * from E6156.customers where customers_id = 'DoFe19';"

con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + JSON.stringify(result, null, 4));
});

for (let i = 0; i < 5; i++) {
    console.log("Hello: " + i);
}