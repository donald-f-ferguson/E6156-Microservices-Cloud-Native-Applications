
// jshint node: true

var		module_name		=	'db';

var		logging			=	require('./logging');
var 	mysql 			= 	require("mysql");

/**********************************************************************************/
//Database utility functions.

var db_con = null;

// 	TODO We should move this to a model in which we keep in an S3 object.
//	Better approach to secure storage of config info.
//
var	db_connect_info = {
		host: "localhost",
		user: "dbuser",
		password: "dbuser"
	};

var set_db_connect_info = function(inf) {
	'use strict';
	db_connect_info = inf;
}

//The active connection to the MySql DB.
//var	db_con;	

var	get_db_connection	=	function() {
	'use strict'
	if (db_con === null) {
		logging.debug_message("db_connect_info = ", db_connect_info)
		db_con = mysql.createConnection(db_connect_info);
		logging.debug_message("Created DB connection");
	}
	return db_con;
}


var	db_end	=	function () {
	'use strict';
	if (db_con) {
		logging.debug_message("Closing connection.");
		db_con.end(function(error) {
			logging.debug_message("connection end = ", error);
		});
	}
};


// 	Helper method for querying the database.
//	Parameters:
//		1.	statement is the SQL statement to execute.
//		2.	context is there to pass the Lambda context.
//	Returns a promise that returns the result of the query or the error.
//
var	execute_query		=	function(statement, values, context) {
	'use strict';
	//logging.debug_message("execute_query (enter), statement = " + statement);
	
	return	new Promise(function(resolve, reject) {
		logging.debug_message("execute_query (enter), statement = " + statement);
		logging.debug_message("values = ", values);
	
		var		con		=	mysql.createConnection(db_connect_info);
		
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
};


exports.execute_query		=	execute_query;
//exports.update_by_id		=	update_by_id;
//exports.get_by_id			=	get_by_id;
//exports.select_by_template	=	select_by_template;

//exports.select_by_template			=	select_by_template;
//exports.get_by_id					=	get_by_id;
//exports.update_by_id				=	update_by_id;
//exports.create						=	create;
//exports.set_db_connect_info			= 	set_db_connect_info;

//console.log("Hello." + set_db_connect_info);

console.log("Dude.");

