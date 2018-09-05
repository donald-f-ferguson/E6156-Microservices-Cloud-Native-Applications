var assert = require('assert');
var _ = require('@sailshq/lodash');
var SchemaBuilder = require('../lib/waterline-schema/schema');
var ForeignKeyMapper = require('../lib/waterline-schema/foreignKeys');
var JoinTableMapper = require('../lib/waterline-schema/joinTables');

describe('Join Table Mapper :: ', function() {
  describe('Auto mapping of foreign keys', function() {
    var schema;

    before(function() {
      var fixtures = [
        {
          identity: 'foo',
          primaryKey: 'id',
          connection: 'bar',
          attributes: {
            id: {
              type: 'number'
            },
            bars: {
              collection: 'bar',
              via: 'foos',
              dominant: true
            }
          }
        },
        {
          identity: 'bar',
          primaryKey: 'id',
          connection: 'bar',
          attributes: {
            id: {
              type: 'number'
            },
            foos: {
              collection: 'foo',
              via: 'bars'
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
    });


    it('should add a junction table for a many to many relationship', function() {
      assert(schema.bar_foos__foo_bars);

      assert.equal(schema.bar_foos__foo_bars.identity, 'bar_foos__foo_bars');
      assert.equal(schema.bar_foos__foo_bars.junctionTable, true);

      assert(schema.bar_foos__foo_bars.schema.foo_bars);
      assert.equal(schema.bar_foos__foo_bars.schema.foo_bars.type, 'number');
      assert.equal(schema.bar_foos__foo_bars.schema.foo_bars.columnName, 'foo_bars');
      assert.equal(schema.bar_foos__foo_bars.schema.foo_bars.foreignKey, true);
      assert.equal(schema.bar_foos__foo_bars.schema.foo_bars.references, 'foo');
      assert.equal(schema.bar_foos__foo_bars.schema.foo_bars.on, 'id');
      assert.equal(schema.bar_foos__foo_bars.schema.foo_bars.groupKey, 'foo');
      assert.equal(schema.bar_foos__foo_bars.schema.foo_bars.model, 'foo');

      assert(schema.bar_foos__foo_bars.schema.bar_foos);
      assert.equal(schema.bar_foos__foo_bars.schema.bar_foos.type, 'number');
      assert.equal(schema.bar_foos__foo_bars.schema.bar_foos.columnName, 'bar_foos');
      assert.equal(schema.bar_foos__foo_bars.schema.bar_foos.foreignKey, true);
      assert.equal(schema.bar_foos__foo_bars.schema.bar_foos.references, 'bar');
      assert.equal(schema.bar_foos__foo_bars.schema.bar_foos.on, 'id');
      assert.equal(schema.bar_foos__foo_bars.schema.bar_foos.groupKey, 'bar');
      assert.equal(schema.bar_foos__foo_bars.schema.bar_foos.model, 'bar');
    });

    it('should update the parent collection to point to the join table', function() {
      assert(schema.foo.schema.bars.references === 'bar_foos__foo_bars');
      assert(schema.foo.schema.bars.on === 'foo_bars');

      assert(schema.bar.schema.foos.references === 'bar_foos__foo_bars');
      assert(schema.bar.schema.foos.on === 'bar_foos');
    });
  });


  describe('mapping of custom foreign keys', function() {
    var schema;

    before(function() {
      var fixtures = [
        {
          identity: 'foo',
          connection: 'bar',
          primaryKey: 'uuid',
          attributes: {
            uuid: {
              type: 'string',
            },
            bars: {
              collection: 'bar',
              via: 'foos'
            }
          }
        },
        {
          identity: 'bar',
          connection: 'bar',
          primaryKey: 'area',
          attributes: {
            area: {
              type: 'number'
            },
            foos: {
              collection: 'foo',
              via: 'bars',
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
      ForeignKeyMapper(schema);
      JoinTableMapper(schema);
    });

    it('should add a junction table for a many to many relationship', function() {
      assert(schema.bar_foos__foo_bars);
      assert.equal(schema.bar_foos__foo_bars.identity, 'bar_foos__foo_bars');
      assert.equal(schema.bar_foos__foo_bars.junctionTable, true);

      assert(schema.bar_foos__foo_bars.schema.foo_bars);
      assert.equal(schema.bar_foos__foo_bars.schema.foo_bars.type, 'string');
      assert.equal(schema.bar_foos__foo_bars.schema.foo_bars.columnName, 'foo_bars');
      assert.equal(schema.bar_foos__foo_bars.schema.foo_bars.foreignKey, true);
      assert.equal(schema.bar_foos__foo_bars.schema.foo_bars.references, 'foo');
      assert.equal(schema.bar_foos__foo_bars.schema.foo_bars.on, 'uuid');
      assert.equal(schema.bar_foos__foo_bars.schema.foo_bars.groupKey, 'foo');

      assert(schema.bar_foos__foo_bars.schema.bar_foos);
      assert.equal(schema.bar_foos__foo_bars.schema.bar_foos.type, 'number');
      assert.equal(schema.bar_foos__foo_bars.schema.bar_foos.columnName, 'bar_foos');
      assert.equal(schema.bar_foos__foo_bars.schema.bar_foos.foreignKey, true);
      assert.equal(schema.bar_foos__foo_bars.schema.bar_foos.references, 'bar');
      assert.equal(schema.bar_foos__foo_bars.schema.bar_foos.on, 'area');
      assert.equal(schema.bar_foos__foo_bars.schema.bar_foos.groupKey, 'bar');
    });
  });


  describe('mapping of custom foreign keys with the wrong `via` value', function() {
    var schema;

    before(function() {
      var fixtures = [
        {
          identity: 'foo',
          connection: 'bar',
          primaryKey: 'uuid',
          attributes: {
            uuid: {
              type: 'string'
            },
            bars: {
              collection: 'bar',
              via: 'foos'
            }
          }
        },
        {
          identity: 'bar',
          connection: 'bar',
          primaryKey: 'area',
          attributes: {
            area: {
              type: 'number'
            },
            foos: {
              collection: 'foo',
              via: 'fake',
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
      ForeignKeyMapper(schema);
    });


    it('should throw an exception message', function() {
      assert.throws(function() {
        JoinTableMapper(schema);
      });
    });
  });


  describe('self-referencing associations', function() {
    var schema;

    before(function() {
      var fixtures = [
        {
          identity: 'foo',
          connection: 'bar',
          primaryKey: 'id',
          attributes: {
            id: {
              type: 'number'
            },

            isFollowing: {
              collection: 'foo',
              via: 'followedBy'
            },

            followedBy: {
              collection: 'foo',
              via: 'isFollowing'
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
    });

    it('should add a junction table for the self referencing attributes', function() {
      // Validate only a single join table gets setup
      assert(schema.foo_followedby__foo_isfollowing);
      assert(!schema.foo_isfollowing__foo_followeby);

      assert(schema.foo_followedby__foo_isfollowing.schema.foo_isFollowing);
      assert.equal(schema.foo_followedby__foo_isfollowing.schema.foo_isFollowing.type, 'number');
      assert.equal(schema.foo_followedby__foo_isfollowing.schema.foo_isFollowing.columnName, 'foo_isFollowing');
      assert.equal(schema.foo_followedby__foo_isfollowing.schema.foo_isFollowing.foreignKey, true);
      assert.equal(schema.foo_followedby__foo_isfollowing.schema.foo_isFollowing.references, 'foo');
      assert.equal(schema.foo_followedby__foo_isfollowing.schema.foo_isFollowing.on, 'id');
      assert.equal(schema.foo_followedby__foo_isfollowing.schema.foo_isFollowing.groupKey, 'foo');

      assert(schema.foo_followedby__foo_isfollowing.schema.foo_followedBy);
      assert.equal(schema.foo_followedby__foo_isfollowing.schema.foo_followedBy.type, 'number');
      assert.equal(schema.foo_followedby__foo_isfollowing.schema.foo_followedBy.columnName, 'foo_followedBy');
      assert.equal(schema.foo_followedby__foo_isfollowing.schema.foo_followedBy.foreignKey, true);
      assert.equal(schema.foo_followedby__foo_isfollowing.schema.foo_followedBy.references, 'foo');
      assert.equal(schema.foo_followedby__foo_isfollowing.schema.foo_followedBy.on, 'id');
      assert.equal(schema.foo_followedby__foo_isfollowing.schema.foo_followedBy.groupKey, 'foo');

      assert.equal(schema.foo.schema.isFollowing.references, 'foo_followedBy__foo_isFollowing');
      assert.equal(schema.foo.schema.isFollowing.on, 'foo_isFollowing');
      assert.equal(schema.foo.schema.followedBy.references, 'foo_followedBy__foo_isFollowing');
      assert.equal(schema.foo.schema.followedBy.on, 'foo_followedBy');
    });
  });


  describe('junction table between the same model', function() {
    var schema;

    before(function() {
      var fixtures = [
        {
          identity: 'foo',
          connection: 'foo',
          primaryKey: 'id',
          attributes: {
            id: {
              type: 'number'
            },
            follows: {
              collection: 'foo',
              through: 'bar',
              via: 'to'
            },
            followers: {
              collection: 'foo',
              through: 'bar',
              via: 'from'
            }
          }
        },
        {
          identity: 'bar',
          connection: 'foo',
          primaryKey: 'id',
          attributes: {
            id: {
              type: 'number'
            },
            to: {
              model: 'foo'
            },
            from: {
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
      ForeignKeyMapper(schema);
      JoinTableMapper(schema);
    });


    it('should expand the attributes on `bar`', function() {
      assert.equal(schema.foo.schema.follows.onKey, 'to');
      assert.equal(schema.foo.schema.follows.on, 'to');

      assert.equal(schema.foo.schema.followers.onKey, 'from');
      assert.equal(schema.foo.schema.followers.on, 'from');
    });
  });
});
