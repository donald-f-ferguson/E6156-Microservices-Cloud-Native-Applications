
//let bcrypt = require('bcrypt');
let logging = require('./logging');
let hasher = require('password-hash');


const saltRounds = 10;


exports.saltAndHash = function(pw) {
   let result = hasher.generate(pw);
   return result;
};

exports.compare = function(pw, hash) {
    let result = hasher.verify(pw, hash);
    return result;
};
