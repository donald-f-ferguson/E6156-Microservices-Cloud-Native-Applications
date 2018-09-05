/**
 * Module dependencies
 */

var assert = require('assert');
var l = require('./');

// Check that lodash is working
assert.equal(typeof l, 'function');
assert.equal(typeof l.map([1,2], function(i){ return i+1;}), 'object');
assert.deepEqual(l.map([1,2], function(i){ return i+1;}), [2,3]);

// Check that it didn't globalize anything.
assert.equal(typeof _, 'undefined');
assert.equal(typeof global._, 'undefined');
assert.equal(typeof process._, 'undefined');
assert.equal(typeof module._, 'undefined');
assert.equal(typeof window, 'undefined');
assert.equal(typeof global.window, 'undefined');

// console.log('-------');
// console.log('typeof _', typeof _);
// console.log('typeof global._', typeof global._);
// console.log('typeof process._', typeof process._);
// console.log('typeof module._', typeof module._);


console.log('ok looks good.');
