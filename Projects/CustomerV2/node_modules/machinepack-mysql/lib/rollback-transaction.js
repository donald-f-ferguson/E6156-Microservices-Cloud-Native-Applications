module.exports = {


  friendlyName: 'Rollback transaction',


  description: 'Abort and revert (i.e. "roll back") the database transaction that was begun on the specified active connection.',


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
      description: 'The transaction was successfully rolled back.',
      extendedDescription: 'Subsequent queries on this connection will no longer be transactional unless a new transaction is begun.',
      outputVariableName: 'report',
      outputDescription: 'The `meta` property is reserved for custom driver-specific extensions.',
      outputExample: '==='
      // outputExample: {
      //   meta: '==='
      // }
    },

    badConnection: {
      friendlyName: 'Meta (custom)',
      description: 'Additional stuff to pass to the driver.',
      extendedDescription: 'This is reserved for custom driver-specific extensions.  Please refer to the documentation for the driver you are using for more specific information.',
      outputExample: '==='
      // outputExample: {
      //   meta: '==='
      // }
    }

  },


  fn: function rollbackTransaction(inputs, exits) {
    var Pack = require('../');

    // Since we're using `sendNativeQuery()` to access the underlying connection,
    // we have confidence it will be validated before being used.
    Pack.sendNativeQuery({
      connection: inputs.connection,
      nativeQuery: 'ROLLBACK'
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
