var assert = require('assert');
var _ = require('@sailshq/lodash');
var WaterlineSchema = require('../lib/waterline-schema');

describe('Sanity Checks :: ', function() {
  it('should error due to non-unique column names', function() {
    var fixtures = [
      {
        identity: 'foo',
        primaryKey: 'id',
        attributes: {
          id: {
            type: 'string',
            columnName: '_id'
          },

          _id: {
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

    assert.throws(
      function() {
        WaterlineSchema(collections);
      }
    );
  });
});
