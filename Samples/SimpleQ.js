/**
 * Created by donaldferguson on 8/12/18.
 */
let path_base = "/Users/donaldferguson/Dropbox/ColumbiaCourse/Courses/Fall2018/E6156/Projects/CustomerV2/";
let logging = require(path_base + "lib/logging");
let mysql = require('mysql');



class Dao {

    constructor(config) {
        this.config = config;
        this.db_con = null;
    }

    sayHello() {
        console.log("config = " + JSON.stringify(this.config,null,4));
    }

    execute_query(statement, values, context) {

        config = this.config;

        return	new Promise(function(resolve, reject) {
            logging.debug_message("execute_query (enter), statement = " + statement);
            logging.debug_message("values = ", values);

            var		con		=	mysql.createConnection(config.db_connect_info);

            logging.debug_message("db.execute_query: After calling con create.");

            con.connect(function(err) {
                if (err) {
                    logging.error_message("DB Connect Failed, ");
                    reject(err);			//	Return the promise error.
                }
                else {
                    logging.debug_message('Connected to DB');

                    con.query(statement, values, function(err,result){		//	Execute the query.
                        if (err) {
                            logging.debug_message("Query failed with error = ", err);
                            con.end();
                            reject(err);
                        }
                        else {
                            //logging.debug_message("Query statement = " + statement + "succeeded, rows = ", result);
                            logging.debug_message("db.execute_query: After query, result = " + JSON.stringify(result, null, 2));
                            con.end();
                            resolve(result);						//	Return the response as promised.
                        }
                    });
                }
            });
        });
    }

    get_by_id(id) {
        let sql_statement = "SELECT * FROM " + this.config.data_table +
            " where " + this.config.primary_key + " = ? ";
        return this.execute_query(sql_statement, [id], null);
    }

    get_by_template(tmpl) {
        // TBD
    }

    create(data) {
        // TBD
    }

    update(data) {
        // TBD
    }

    delete(id) {
        // TBD

    }


}

let	config = {
    db_connect_info: {
        host: "localhost",
        user: "dbuser",
        password: "dbuser"
    },
    data_table: "e6156.customers",
    primary_key: "customers_id"
};

let d = new Dao(config);
d.sayHello();
d.get_by_id('df1').then(
    function(data) {
        "use strict";
        logging.debug_message("Data = ", data)
    }
);
