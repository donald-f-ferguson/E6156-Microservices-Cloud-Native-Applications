module.exports = {


  friendlyName: 'Commit transaction',


  description: 'Commit the database transaction on the provided connection.',


  extendedDescription: 'The provided connection must already have a transaction begun on it.',


  moreInfoUrl: 'http://dev.mysql.com/doc/refman/5.7/en/commit.html',


  inputs: {

    connection: {
      friendlyName: 'Connection',
      description: 'An active database connection.',
      extendedDescription: 'The provided database connection instance must still be active.  Only database connection instances created by the `getConnection()` machine in this driver are supported.',
      example: '===',
      required: true
    },

    meta: {
      friendlyName: 'Meta (custom)',
      description: 'Additional stuff to pass to the driver.',
      extendedDescription: 'This is reserved for custom driver-specific extensions.  Please refer to the documentation for the driver you are using for more specific information.',
      example: '==='
    }

  },


  exits: {

    success: {
      description: 'The transaction was successfully committed.',
      extendedDescription: 'Subsequent queries on this connection will no longer be transactional unless a new transaction is begun.',
      outputVariableName: 'report',
      outputDescription: 'The `meta` property is reserved for custom driver-specific extensions.',
      outputExample: '==='
      // outputExample: {
      //   meta: '==='
      // }
    },

    badConnection: {
      friendlyName: 'Bad connection',
      description: 'The provided connection is not valid or no longer active.  Are you sure it was obtained by calling this driver\'s `getConnection()` method?',
      extendedDescription: 'Usually, this means the connection to the database was lost due to a logic error or timing issue in userland code.  In production, this can mean that the database became overwhelemed or was shut off while some business logic was in progress.',
      outputVariableName: 'report',
      outputDescription: 'The `meta` property is reserved for custom driver-specific extensions.',
      outputExample: '==='
      // outputExample: {
      //   meta: '==='
      // }
    }

  },


  fn: function commitTransaction(inputs, exits) {
    var Pack = require('../');

    // Since we're using `sendNativeQuery()` to access the underlying connection,
    // we have confidence it will be validated before being used.
    Pack.sendNativeQuery({
      connection: inputs.connection,
      nativeQuery: 'COMMIT'
    }).switch({
      error: function error(err) {
        return exits.error(err);
      },
      badConnection: function badConnection() {
        return exits.badConnection({
          meta: inputs.meta
        });
      },
      success: function success() {
        return exits.success({
          meta: inputs.meta
        });
      }
    });
  }


};
