module.exports = {


  friendlyName: 'Release connection',


  description: 'Release an active MySQL database connection back to the pool.',


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
      description: 'The connection was released and is no longer active.',
      extendedDescription: 'The provided connection may no longer be used for any subsequent queries.',
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


  fn: function releaseConnection(inputs, exits) {
    var validateConnection = require('./private/validate-connection');

    // Validate provided connection.
    if (!validateConnection({ connection: inputs.connection }).execSync()) {
      return exits.badConnection({
        meta: inputs.meta
      });
    }

    // Release connection.
    try {
      // Note that if this driver is adapted to support managers which spawn
      // ad-hoc connections or manage multiple pools/replicas using PoolCluster,
      // then relevant settings would need to be included in the manager instance
      // so that connections can be appropriately released/destroyed here.
      //
      // For now, since we only support a single pool, we simply release the
      // connection back to the pool.
      inputs.connection.release();

      // If we made it here, releasing the connection gracefully must have worked.
      return exits.success();
    } catch (_releaseErr) {
      // If the connection cannot be released back to the pool gracefully,
      // try to force it to disconnect.
      try {
        inputs.connection.destroy();

        // If even THAT fails, exit via `error`.
      } catch (_destroyErr) {
        return exits.error(new Error('Could not release MySQL connection gracefully, and attempting to forcibly destroy the connection threw an error.  Details:\n=== === ===\n' + _destroyErr.stack + '\n\nAnd error details from the original graceful attempt:\n=== === ===\n' + _releaseErr.stack));
      }

      // Otherwise if we're here, while we could not release the MySQL connection
      // gracefully, we were able to forcibly destroy it.
      return exits.success({
        meta: inputs.meta
      });
    }
  }


};
