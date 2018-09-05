var assert = require('assert');
var _ = require('@sailshq/lodash');
var SchemaBuilder = require('../lib/waterline-schema/schema');
var ForeignKeyMapper = require('../lib/waterline-schema/foreignKeys');
var JoinTableMapper = require('../lib/waterline-schema/joinTables');
var ReferenceMapper = require('../lib/waterline-schema/references');

describe('Reference Mapper :: ', function() {
  describe('With automatic column name', function() {
    var schema;

    before(function() {
      var fixtures = [
        {
          identity: 'foo',
          primaryKey: 'id',
          attributes: {
            id: {
              type: 'number'
            },
            name: {
              type: 'string'
            },
            bars: {
              collection: 'bar',
              via: 'foo'
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
              columnName: 'foo_id'
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
      ForeignKeyMapper(schema);
      JoinTableMapper(schema);
      ReferenceMapper(schema);
    });


    /**
     * Test that a reference to bar gets built for the foo table:
     *
     * attributes: {
     *   bars: {
     *     collection: 'foo'
     *     references: 'bar',
     *     on: 'bar_id'
     *   }
     * }
     */

    it('should add a reference to the bar table', function() {
      assert(schema.foo.schema.bars);
      assert.equal(schema.foo.schema.bars.collection, 'bar');
      assert.equal(schema.foo.schema.bars.references, 'bar');
      assert.equal(schema.foo.schema.bars.on, 'foo_id');
    });
  });
});
