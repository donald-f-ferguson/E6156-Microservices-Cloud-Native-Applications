# Waterline SQL Builder

Build SQL queries (stage 5 queries) from Waterline statements (stage 4 queries).

> For more information, see https://github.com/balderdashy/waterline/blob/d782be4ba5b3daefc27850e90d81b01d3709c6bc/ARCHITECTURE.md#stage-4-query.

## Purpose

This is a replacement for the [Waterline-Sequel](https://github.com/balderdashy/waterline-sequel) package in newer specs of the Waterline adapter interface. It is not backwards compatible.

Behind the scenes, this uses [knex](http://knexjs.org) to compile SQL queries which should be valid in any supported
database. (The core Sails/Waterline adapters for SQL databases use this library internally.)

> Refer to [**Concepts > Models and ORM**](http://sailsjs.com/documentation/concepts/models-and-orm) for information on how to run queries from app-level code.
> Or, if you are building a lower-level Node.js package, see [Waterline Query Docs](https://github.com/treelinehq/waterline-query-docs) for more information on Waterline statements (aka [stage 4 queries](https://github.com/balderdashy/waterline/blob/88bdfac31844e367a979661c4232fd5f521f3a33/ARCHITECTURE.md#stage-4-query)).
> Keep in mind that [using Waterline statements from app-level code is _experimental_](http://sailsjs.com/documentation/reference/waterline-orm/datastores/send-statement) and should be treated accordingly.  While this package follows semver, from the perspective of application code, breaking changes could occur at any time (e.g. since this kind of usage is experimental, Waterline adapters could upgrade their `waterline-sql-builder` dependency via a major version bump)


## Usage

This module is meant to be used by adapter authors who need to generate a query to run on a given driver. Example usage is below:

```javascript
var SQLBuilder = require('waterline-sql-builder');
var compile = SQLBuilder({ dialect: 'postgres' }).generate;

// Compile a statement to obtain a SQL template string and an array of bindings.
var report = compile({
  select: ['id'],
  where: {
    firstName: 'Test',
    lastName: 'User'
  },
  from: 'users'
});

console.log(report);
//=>
//{
//  sql: 'select "id" from "users" where "firstName" = $1 and "lastName" = $2',
//  bindings: ['Test', 'User']
//}
```


## Help

If you have questions or are having trouble, click [here](http://sailsjs.com/support).


## Bugs &nbsp; [![NPM version](https://badge.fury.io/js/waterline-sql-builder.svg)](http://npmjs.com/package/waterline-sql-builder)

To report a bug, [click here](http://sailsjs.com/bugs).


## Contributing &nbsp; [![Build Status](https://travis-ci.org/treelinehq/waterline-sql-builder.svg?branch=master)](https://travis-ci.org/treelinehq/waterline-sql-builder)

Please observe the guidelines and conventions laid out in the [Sails project contribution guide](http://sailsjs.com/documentation/contributing) when opening issues or submitting pull requests.

[![NPM](https://nodei.co/npm/waterline-sql-builder.png?downloads=true)](http://npmjs.com/package/waterline-sql-builder)


## License

This package, like the [Sails framework](http://sailsjs.com), is free and open-source under the [MIT License](http://sailsjs.com/license).
