var assert = require('assert');
var _ = require('@sailshq/lodash');
var SchemaBuilder = require('../lib/waterline-schema/schema');
var ForeignKeyMapper = require('../lib/waterline-schema/foreignKeys');

describe('Foreign Key Mapper :: ', function() {
  describe('With automatic column name properties', function() {
    var schema;

    before(function() {
      var fixtures = [
        {
          identity: 'foo',
          primaryKey: 'id',
          attributes: {
            id: {
              type: 'string'
            }
          }
        },
        {
          identity: 'bar',
          primaryKey: 'id',
          attributes: {
            id: {
              type: 'number'
            },
            foo: {
              model: 'foo'
            }
          }
        }
      ];

      var collections = _.map(fixtures, function(obj) {
        var collection = function() {};
        collection.prototype = obj;
        return collection;
      });

      // Build the schema
      schema = SchemaBuilder(collections);
    });

    /**
     * Test that a foreign key gets built for the bar table in the following structure:
     *
     * attributes: {
     *   foo: {
     *     columnName: 'foo',
     *     type: 'number',
     *     foreignKey: true,
     *     references: 'foo',
     *     on: 'id'
     *   }
     * }
     */

    it('should add a foreign key mapping to the bar collection', function() {
      // Map out the foreign keys
      ForeignKeyMapper(schema);
      var barSchema = schema.bar.schema;

      assert.equal(barSchema.foo.columnName, 'foo');
      assert.equal(barSchema.foo.type, 'string');
      assert.equal(barSchema.foo.foreignKey, true);
      assert.equal(barSchema.foo.references, 'foo');
      assert.equal(barSchema.foo.on, 'id');
    });
  });

  describe('with custom column names', function() {
    var schema;

    before(function() {
      var fixtures = [
        {
          identity: 'foo',
          primaryKey: 'id',
          attributes: {
            id: {
              type: 'string'
            }
          }
        },
        {
          identity: 'bar',
          primaryKey: 'id',
          attributes: {
            id: {
              type: 'number'
            },
            foo: {
              model: 'foo',
              columnName: 'xyz_foo_id'
            }
          }
        }
      ];

      var collections = _.map(fixtures, function(obj) {
        var collection = function() {};
        collection.prototype = obj;
        return collection;
      });

      // Build the schema
      schema = SchemaBuilder(collections);
    });


    /**
     * Test that a foreign key gets built for the bar table in the following structure:
     *
     * attributes: {
     *   foo: {
     *     columnName: 'xyz_foo_id',
     *     type: 'integer',
     *     foreignKey: true,
     *     references: 'foo',
     *     on: 'id'
     *   }
     * }
     */

    it('should add a foreign key mapping to the custom column name', function() {
      // Map out the foreign keys
      ForeignKeyMapper(schema);
      var barSchema = schema.bar.schema;

      assert.equal(barSchema.foo.columnName, 'xyz_foo_id');
      assert.equal(barSchema.foo.type, 'string');
      assert.equal(barSchema.foo.foreignKey, true);
      assert.equal(barSchema.foo.references, 'foo');
      assert.equal(barSchema.foo.on, 'id');
    });
  });

  describe('With custom column type', function() {
    var schema;

    before(function() {
      var fixtures = [
        {
          identity: 'foo',
          primaryKey: 'id',
          attributes: {
            id: {
              type: 'string'
            }
          }
        },
        {
          identity: 'bar',
          primaryKey: 'id',
          attributes: {
            id: {
              type: 'number'
            },
            foo: {
              model: 'foo',
              autoMigrations: {
                columnType: 'foobar'
              }
            }
          }
        }
      ];

      var collections = _.map(fixtures, function(obj) {
        var collection = function() {};
        collection.prototype = obj;
        return collection;
      });

      // Build the schema
      schema = SchemaBuilder(collections);
    });

    /**
     * Test that a foreign key gets built for the bar table in the following structure:
     *
     * attributes: {
     *   foo: {
     *     columnName: 'foo',
     *     type: 'number',
     *     foreignKey: true,
     *     references: 'foo',
     *     on: 'id'
     *   }
     * }
     */

    it('should add a foreign key mapping to the bar collection', function() {
      // Map out the foreign keys
      ForeignKeyMapper(schema);
      var barSchema = schema.bar.schema;

      assert.equal(barSchema.foo.columnName, 'foo');
      assert.equal(barSchema.foo.type, 'foobar');
      assert.equal(barSchema.foo.foreignKey, true);
      assert.equal(barSchema.foo.references, 'foo');
      assert.equal(barSchema.foo.on, 'id');
    });
  });
});
