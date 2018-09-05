// Dependencies
var _ = require('@sailshq/lodash');

module.exports = {


  friendlyName: 'Parse native query error',


  description: 'Attempt to identify and parse a raw error from sending a native query and normalize it to a standard error footprint.',


  moreInfoUrl: 'https://github.com/node-machine/waterline-driver-interface#footprints',


  sideEffects: 'cacheable',


  sync: true,


  inputs: {

    nativeQueryError: {
      description: 'The error sent back from the database as a result of a failed native query.',
      extendedDescription: 'This is referring to the raw error; i.e. the `error` property of the dictionary returned through the `queryFailed` exit of `sendNativeQuery()` in this driver.',
      required: true,
      example: '==='
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
      description: 'The normalization is complete.  If the error cannot be normalized into any other more specific footprint, then the catchall footprint will be returned.',
      moreInfoUrl: 'https://github.com/node-machine/waterline-driver-interface#footprints',
      outputVariableName: 'report',
      outputDescription: 'The `footprint` property is the normalized "footprint" representing the provided raw error.  Conforms to one of a handful of standardized footprint types expected by the Waterline driver interface.   The `meta` property is reserved for custom driver-specific extensions.',
      outputExample: '==='
      // example: {
      //   footprint: {},
      //   meta: '==='
      // }
    },

  },


  fn: function parseNativeQueryError(inputs, exits) {
    // Quick reference of hand-tested errors:

    // --o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o-<>
    // `code`  : 'ER_PARSE_ERROR'
    // `errno`  : 1064
    // `sqlState`  : '42000'
    // `index`  : 0
    // --o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o-<>

    // --o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o-<>
    // `code`  : 'ER_NO_SUCH_TABLE'
    // `errno`  : 1146
    // `sqlState`  : '42S02'
    // `index`  : 0
    // --o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o-<>

    // --o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o-<>
    // `code`  : 'ER_DUP_ENTRY'
    // `errno`  : 1062
    // `sqlState`  : '23000'
    // `index`  : 0
    // --o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o-<>


    // Local variable (`err`) for convenience.
    var err = inputs.nativeQueryError;

    // `footprint` is primarily what will be returned by this machine.
    // For miscellaneous errors which are not explicitly in the
    // spec, return the catchall footprint.  Drivers should not
    // add their own additional footprints-- instead, if they want
    // to allow for easily identifying a particular error, the
    // `catchall` footprint should still be used; but additional
    // information sent back in `meta`.
    var footprint = { identity: 'catchall' };


    // If the incoming native query error is not an object, or it is
    // missing a `code` property, then we'll go ahead and bail out w/
    // the "catchall" footprint to avoid continually doing these basic
    // checks in the more detailed error negotiation below.
    if (!_.isObject(err) || !err.code) {
      return exits.success({
        footprint: footprint,
        meta: inputs.meta
      });
    }


    //
    // Otherwise, continue inspecting the native query error in more detail.
    //

    // > Note that the conditional blocks below are **disjoint**--
    // > that is, only one of them should be run.


    // --o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o-<>
    // `code`  : 'ER_DUP_ENTRY'
    // `errno`  : 1062
    // `sqlState`  : '23000'
    // `index`  : 0
    //
    //   -- Recognized as the `notUnique` footprint from the
    //      Waterline driver spec.  If additional information
    //      is needed in userland beyond what is guaranteed in
    //      the spec, then you should take advantage of `meta`.
    // --o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o-<>
    if (err.code === 'ER_DUP_ENTRY') {
      // Negotiate `notUnique` error footprint.
      footprint = {
        identity: 'notUnique',
        keys: []
      };
      // Now build our footprint's `keys` property by manually parsing
      // the MySQL error message and extracting the relevant bits.
      // (See also: https://github.com/balderdashy/sails-mysql/blob/2c414f1191c3595df2cea8e40259811eb3ca05f9/lib/adapter.js#L1223)
      if (_.isString(err.message)) {
        var matches = err.message.match(/Duplicate entry '.*' for key '(.*?)'$/);
        if (matches && matches.length > 0) {
          footprint.keys.push(matches[1]);
        }
      }
    }


    // --o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o-<>
    // `code`  : 'ER_NO_SUCH_TABLE'
    // `errno`  : 1146
    // `sqlState`  : '42S02'
    // `index`  : 0
    //
    //   -- Not in specification yet; just listed here for
    //      reference. If this driver wants to move ahead of
    //      the core Waterline/machine spec, this can be handled
    //      using the `catchall` footprint + `meta`.
    // --o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o-<>
    // else if ( ... ){
    //   footprint = { identity: 'catchall' };
    //   // e.g.
    //   meta = { problem: 'noSuchTable', foo: ..., bar: ... };
    // }


    // --o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o-<>
    // `code`  : 'ER_PARSE_ERROR'
    // `errno`  : 1064
    // `sqlState`  : '42000'
    // `index`  : 0
    //
    //   -- Not in specification yet; just listed here for
    //      reference. If this driver wants to move ahead of
    //      the core Waterline/machine spec, this can be handled
    //      using the `catchall` footprint + `meta`.
    // --o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o--o-<>
    // else if ( ... ){
    //   footprint = { identity: 'catchall' };
    //   // e.g.
    //   meta = { problem: 'couldNotParse', foo: ..., bar: ... };
    // }


    // Finally, return the normalized footprint.
    //
    // (as well as any additional metadata that was stuffed
    //  into `meta` above)
    return exits.success({
      footprint: footprint,
      meta: inputs.meta
    });
  }


};
