module.exports = {


  friendlyName: 'Destroy manager',


  description: 'Destroy the specified connection manager and destroy all of its active connections.',


  inputs: {

    manager: {
      friendlyName: 'Manager',
      description: 'The connection manager instance to destroy.',
      extendedDescription: 'Only managers built using the `createManager()` method of this driver are supported.  Also, the database connection manager instance provided must not have already been destroyed--i.e. once `destroyManager()` is called on a manager, it cannot be destroyed again (also note that all existing connections become inactive).',
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
      description: 'The specified manager and all of its active connections were successfully destroyed.',
      outputVariableName: 'report',
      outputDescription: 'The `meta` property is reserved for custom driver-specific extensions.',
      outputExample: '==='
      // example: {
      //   meta: '==='
      // }
    },

    failed: {
      friendlyName: 'Failed',
      description: 'Could not destroy the provided connection manager.',
      extendedDescription:
        'Usually, this means the manager has already been destroyed.  But depending on the driver ' +
        'it could also mean that database cannot be accessed.  In production, this can mean that the database ' +
        'server(s) became overwhelemed or were shut off while some business logic was in progress.',
      outputVariableName: 'report',
      outputDescription: 'The `error` property is a JavaScript Error instance with more information and a stack trace.  The `meta` property is reserved for custom driver-specific extensions.',
      outputExample: '==='
      // example: {
      //   error: '===',
      //   meta: '==='
      // }
    }

  },


  fn: function destroyManager(inputs, exits) {
    // Note that if this driver is adapted to support managers which spawn
    // ad-hoc connections or manage multiple pools/replicas using PoolCluster,
    // then relevant settings would need to be included in the manager instance
    // so that the manager could be appropriately destroyed here (in the case of
    // ad-hoc connections, leased connections would need to be tracked on the
    // manager, and then rounded up and disconnected here.)
    //
    // For now, since we only support a single pool, we simply destroy it.
    //
    // For more info, see:
    //  • https://github.com/felixge/node-mysql/blob/v2.10.2/Readme.md#closing-all-the-connections-in-a-pool
    inputs.manager.pool.end(function end(err) {
      if (err) {
        return exits.failed({
          error: new Error('Failed to destroy the MySQL connection pool and/or gracefully end all connections in the pool.  Details:\n=== === ===\n' + err.stack),
          meta: inputs.meta
        });
      }
      // All connections in the pool have ended.
      return exits.success({
        meta: inputs.meta
      });
    });
  }


};
