module.exports = require('machine').build({


  friendlyName: 'Validate connection',


  description: 'Check if this looks like a valid MySQL connection instance.',


  sideEffects: 'cacheable',


  sync: true,


  inputs: {

    connection: {
      friendlyName: 'Connection',
      description: 'An active database connection.',
      extendedDescription: 'The provided database connection instance must still be active.  Only database connection instances created by the `getConnection()` machine in this driver are supported.',
      example: '===',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Is probably MySQL connection',
      outputDescription: 'If the provided appears to be a valid MySQL connection instance.',
      outputExample: true
    },

  },


  fn: function validateConnection(inputs, exits) {
    var _ = require('@sailshq/lodash');

    // Validate some basic assertions about the provided connection.
    // (this doesn't guarantee it's still active or anything, but it does let
    //  us know that it at least _HAS_ the properly formatted methods and properties
    //  necessary for internal use in this Waterline driver)
    return exits.success(
      _.isObject(inputs.connection) &&
      _.isFunction(inputs.connection.query) &&
      _.isFunction(inputs.connection.destroy) &&
      (
        // • If you are pooling: `.release()`
        _.isFunction(inputs.connection.release) ||
        // • AND/OR if you are not pooling: `.end()`
        _.isFunction(inputs.connection.end)
      )
    );
  }


});
