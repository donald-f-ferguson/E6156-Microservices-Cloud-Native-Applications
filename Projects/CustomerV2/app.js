let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');


let index = require('./routes/index');
let users = require('./routes/users');
let customers = require('./routes/customers-full');
let security = require('./middleware/security');

let logging = require('./lib/logging');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// !!!!!!!!!!!!!!!!
// This will become important when we discuss middleware and also multi-tenancy.
app.use('/', function(req, res, next) {
    //logging.debug_message("headers = ", req.headers);
    let dnsFields = req.headers['host'].split('.');
    //req.tenant = dnsFields[0];
    req.tenant = 'E6156';
    next();
});
app.use('/', security.authorize);
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/users', users);


// Connect paths to route handlers.
// I have had problems with the Router module in Express and do it this way.
// This could all be driven off of a config file.
app.get('/customers/:id', customers.get_by_id);
app.get('/customers', customers.get_by_query);
app.post('/customers', customers.post);
app.post('/register', customers.register);
app.post('/login', customers.login);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;