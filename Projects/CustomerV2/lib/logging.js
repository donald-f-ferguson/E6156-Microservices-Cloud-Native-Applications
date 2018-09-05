/***************************************************************************/
//
//
/*
var	StackTrace		=	require('stacktrace-js');

var callback = function(stackframes) {
    var stringifiedStack = stackframes.map(function(sf) {
        return sf.toString();
    }).join('\n');
    console.log('\n\n\n');
    console.log(stringifiedStack);
    console.log('\n\n\n');
};
*/
var errback = function(err) { console.log(err.message); };
 
var	trace_level			=	3;
var	debug_level			=	0;

var	local				=	true;

var	debug_on			=	true;
var	error_on			=	true;
var	debug_l				=	debug_level;

var	set_levels			=	function(debug_it, error_it, is_local, level) {
	debug_on	=	debug_it;
	error_on	=	error_it;
	local		=	is_local;
	debug_l		=	level;		
	
	console.log("Setting debug to on = " + debug_on + ", error on = " + error_on + ", is local = " + local + ", level = " + debug_l);
};

var console_message		=	function(s,o) {
	var	msg		=	s;
	if ((o !== null) && (o !== undefined)) {
		if (local) {
			msg = msg + " " + JSON.stringify(o, null, 2);
		}
		else {
			msg = msg + " " + JSON.stringify(o);
		}
	}
	console.log(msg);
	
};

var	debug_message		=	function(s, o, l) {
	
	var	level;
	
	if ((l === undefined) || (l === null)) {
		level			=	debug_level;
	}
	else {
		level			=	l;
	}
	
	//console.log("l = " + l + " and debug level = " + debug_l + " and level = " + level);
	
	if ((debug_on)&&(level >= debug_l)) {
		console_message(s,o);
	}
};
var	error_message		=	function(s,o) {
	if (error_on) {
		console_message(s,o);
	}
	//StackTrace.get().then(callback,errback);
};


exports.debug_message		=	debug_message;
exports.error_message		=	error_message;
exports.set_levels			=	set_levels;
exports.trace_level			=	trace_level;
