var assert = require('assert');
var _ = require('@sailshq/lodash');
var SchemaBuilder = require('../lib/waterline-schema');

describe('Meta Extended Data :: ', function() {
  describe('On Models', function() {
    var schema;

    before(function() {
      var fixtures = [
        {
          identity: 'user',
          primaryKey: 'id',
          meta: {
            schemaName: 'foo'
          },
          attributes: {
            id: {
              type: 'number'
            },
            name: {
              type: 'string'
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
            age: {
              type: 'number'
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

    it('should keep the meta key on the user collection', function() {
      assert(schema.user.meta);
      assert.equal(schema.user.meta.schemaName, 'foo');
    });

    it('should add an empty meta object to the car collection', function() {
      assert(schema.car.meta);
      assert.equal(_.keys(schema.car.meta).length, 0);
    });
  });

  describe('On generated join tables', function() {
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
              via: 'drivers'
            }
          }
        },
        {
          identity: 'car',
          primaryKey: 'id',
          meta: {
            schemaName: 'foo'
          },
          attributes: {
            id: {
              type: 'number'
            },
            drivers: {
              collection: 'user',
              via: 'cars',
              dominant: true
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

    it('should add the meta data to the join table', function() {
      assert(schema.car_drivers__user_cars);
      assert(schema.car_drivers__user_cars.meta);
      assert.equal(schema.car_drivers__user_cars.meta.schemaName, 'foo');
    });
  });
});
