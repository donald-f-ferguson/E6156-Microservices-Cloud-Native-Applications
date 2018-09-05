// Build up a SQLBuilder instance when the file is required rather than when the
// function is run.
var SQLBuilder = require('waterline-sql-builder')({
  dialect: 'mysql'
});

module.exports = {


  friendlyName: 'Compile statement',


  description: 'Compile a Waterline statement to a native query for MySQL.',


  sideEffects: 'cacheable',


  sync: true,


  inputs: {

    statement: {
      description: 'A Waterline statement.',
      extendedDescription: 'See documentation for more information.  Note that `opts` may be used for expressing driver-specific customizations as a sibling to `from`, `where`, `select`, etc.  In other words, recursively deep within a Waterline query statement.  This is distinct from `meta`, which contains driver-specific customizations about the statement as a whole.',
      moreInfoUrl: 'https://github.com/particlebanana/waterline-query-builder/blob/master/docs/syntax.md',
      example: '===',
      // example: {},
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
      description: 'The provided Waterline statement was compiled successfully.',
      outputVariableName: 'report',
      outputDescription: 'The `nativeQuery` property is the compiled native query for the database.  The `meta` property is reserved for custom driver-specific extensions.',
      outputExample: '==='
      // example: {
      //   nativeQuery: 'SELECT * FROM foo',
      //   valuesToEscape: ['foo']
      //   meta: '==='
      // }
    },

    malformed: {
      description: 'The provided Waterline statement could not be compiled due to malformed syntax.',
      outputVariableName: 'report',
      outputDescription: 'The `error` property is a JavaScript error instance explaining that (or preferably even _why_) the Waterline syntax is not valid.  The `meta` property is reserved for custom driver-specific extensions.',
      outputExample: '==='
      // example: {
      //   error: '===',
      //   meta: '==='
      // }
    },

    notSupported: {
      description: 'The provided Waterline statement could not be compiled because it is not supported by this MySQL driver.',
      extendedDescription: 'If even one clause of the Waterline statement is not supported by the MySQL driver, the compilation of the entire statement _always fails_.',
      outputVariableName: 'report',
      outputDescription: 'The `error` property is a JavaScript error instance explaining that (or preferably even _why_) the Waterline statement is not supported.  The `meta` property is reserved for custom driver-specific extensions.',
      outputExample: '==='
      // example: {
      //   error: '===',
      //   meta: '==='
      // }
    }

  },


  fn: function compileStatement(inputs, exits) {
    var compiledNativeQuery;
    try {
      compiledNativeQuery = SQLBuilder.generate(inputs.statement);
    } catch (err) {
      if (!err.code || err.code === 'error') {
        return exits.error(err);
      }

      if (err.code === 'malformed') {
        return exits.malformed({
          error: err,
          meta: inputs.meta
        });
      }

      if (err.code === 'notSupported') {
        return exits.notSupported({
          error: err,
          meta: inputs.meta
        });
      }

      return exits.error(err);
    }


    // Attach a flag to the meta object to denote that the query was generated
    // with Knex and that its valuesToEscape don't need to be processed any further.
    var meta = inputs.meta || {};
    meta.isUsingQuestionMarks = true;

    return exits.success({
      nativeQuery: compiledNativeQuery.sql,
      valuesToEscape: compiledNativeQuery.bindings || [],
      meta: meta
    });
  }


};
