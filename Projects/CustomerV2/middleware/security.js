
let jwt = require('jsonwebtoken');

// DO NOT EVER PUT SECRETS IN CODE.
let secret = "secret";

// This kind of stuff would be configured in some kind of DB.
// We are going to handle security more systematically later in the course.
let roles = ['user', 'admin'];
let get_roles = function(id) {
    if (id == 'dofe1') {
        return 'admin'
    }
    else {
        return 'user'
    }
};


let generate_jwt = function(data, context) {

    let result = {};
    result.tenant_id = context.tenant;
    result.claims = data;

    result = jwt.sign(result, secret);
    return result;

};

exports.generate_customer_claims = function(c, context) {
    let result = {
        paths: ['/customers/' + c.id],
        email: c.email,
        id: c.id
    };
    result.roles = get_roles(c.id);
    result = generate_jwt(result, context);
    return result;
};

let get_claims_from_token = function(t) {
    let result = jwt.decode(t);
    return result;
};

let whiteList = [
    "",
    "images",
    "javascripts",
    "stylesheets",
    "e6156",
    "login",
    "register"
];

let inWhitelist = function(url) {
    let resource = url.split("/");
    console.log("resource = " + JSON.stringify(resource, null, 2));

    if (whiteList.includes(resource[1])) {
        console.log("URL on white list")
        return true;
    }
    return false;

};

let path_ok = function(url, claims) {
    if (claims.roles == 'admin') {
        return true;
    }
    if (claims && claims.claims && claims.claims.paths) {
        let p = claims.claims.paths;
        if (p.includes(url)) {
            return true;
        }
    }
    else {
        return false;
    }
};

let authorize = function(req, rsp, next) {
    console.log("In authorize: Going to next.");
    console.log("Original URL = " + req.originalUrl);
    let claims = null;

    if (req.headers['authorization']) {
        claims = get_claims_from_token(req.headers['authorization']);
        if (claims) {
            console.log("claims = " + JSON.stringify(claims));
        }
    }
    else {
        console.log("No authorization header.");
    }

    if (claims && claims.claims && claims.claims.roles == 'admin') {
        next();
    }
    else {

        if (inWhitelist(req.originalUrl)) {
            next();
        }
        else {
            if (claims && path_ok(req.originalUrl, claims)) {
                next()
            }
            else {
                rsp.status(401).send("NOT AUTHORIZED");
            }
        }
    }
};



exports.authorize = authorize;