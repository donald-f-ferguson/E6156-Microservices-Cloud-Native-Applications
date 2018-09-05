var assert = require('assert');
var _ = require('@sailshq/lodash');
var SchemaBuilder = require('../lib/waterline-schema');

describe('Has Many Through :: ', function() {
  describe('Junction Tables', function() {
    var schema;

    before(function() {
      var fixtures = [
        {
          identity: 'user',
          primaryKey: 'id',
          attributes: {
            id: {
              type: 'number'
            },
            cars: {
              collection: 'car',
              through: 'drive',
              via: 'user'
            }
          }
        },

        {
          identity: 'drive',
          primaryKey: 'id',
          attributes: {
            id: {
              type: 'number'
            },
            car: {
              model: 'car'
            },
            user: {
              model: 'user'
            }
          }
        },

        {
          identity: 'car',
          primaryKey: 'id',
          attributes: {
            id: {
              type: 'number'
            },
            drivers: {
              collection: 'user',
              through: 'drive',
              via: 'car'
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

    it('should flag the "through" table and not mark it as a junction table', function() {
      assert(schema.drive);
      assert(!schema.drive.junctionTable);
      assert(schema.drive.throughTable);
    });
  });

  describe('Reference Mapping', function() {
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
            bars: {
              collection: 'bar',
              through: 'foobar',
              via: 'foo'
            }
          }
        },

        {
          identity: 'foobar',
          primaryKey: 'id',
          attributes: {
            id: {
              type: 'number'
            },
            type: {
              type: 'string'
            },
            foo: {
              model: 'foo',
              columnName: 'foo_id'
            },
            bar: {
              model: 'bar',
              columnName: 'bar_id'
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
              collection: 'foo',
              through: 'foobar',
              via: 'bar'
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

    it('should update the parent collection to point to the join table', function() {
      assert.equal(schema.foo.schema.bars.references, 'foobar');
      assert.equal(schema.foo.schema.bars.on, 'foo_id');
    });
  });
});
