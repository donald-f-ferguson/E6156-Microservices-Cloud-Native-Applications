var Sequelizer = require('../../../index')({ dialect: 'postgres' }).sequelizer;
var analyze = require('../../support/analyze');
var assert = require('assert');

describe('Sequelizer ::', function() {
  describe('Subqueries', function() {
    describe('used as a predicate', function() {
      it('should generate a valid query for an IN subquery', function() {
        var tree = analyze({
          select: ['*'],
          where: {
            and: [
              {
                id: {
                  in: {
                    select: ['id'],
                    from: 'users',
                    where: {
                      or: [
                        { status: 'active' },
                        { name: 'John' }
                      ]
                    }
                  }
                }
              }
            ]
          },
          from: 'accounts'
        });

        var result = Sequelizer(tree);
        assert.equal(result.sql, 'select * from "accounts" where "id" in (select "id" from "users" where "status" = $1 or "name" = $2)');
        assert.deepEqual(result.bindings, ['active', 'John']);
      });

      it('should generate a valid query for a NOT IN subquery', function() {
        var tree = analyze({
          select: ['*'],
          from: 'accounts',
          where: {
            and: [
              {
                id: {
                  nin: {
                    select: ['id'],
                    from: 'users',
                    where: {
                      or: [
                        { status: 'active' },
                        { name: 'John' }
                      ]
                    }
                  }
                }
              }
            ]
          }
        });

        var result = Sequelizer(tree);
        assert.equal(result.sql, 'select * from "accounts" where "id" not in (select "id" from "users" where "status" = $1 or "name" = $2)');
        assert.deepEqual(result.bindings, ['active', 'John']);
      });
    });

    describe('used as scalar values', function() {
      it('should generate a valid query when used inside a SELECT', function() {
        var tree = analyze({
          select: ['name', {
            select: ['username'],
            from: 'users',
            where: {
              or: [
                { status: 'active' },
                { name: 'John' }
              ]
            },
            as: 'username'
          }, 'age'],
          from: 'accounts'
        });

        var result = Sequelizer(tree);
        assert.equal(result.sql, 'select "name", (select "username" from "users" where "status" = $1 or "name" = $2) as "username", "age" from "accounts"');
        assert.deepEqual(result.bindings, ['active', 'John']);
      });

      it('should generate a valid query when used as a value in a WHERE', function() {
        var tree = analyze({
          select: ['name', 'age'],
          from: 'accounts',
          where: {
            and: [
              {
                username: {
                  select: ['username'],
                  from: 'users',
                  where: {
                    color: 'accounts.color'
                  }
                }
              }
            ]
          }
        });

        var result = Sequelizer(tree);
        assert.equal(result.sql, 'select "name", "age" from "accounts" where "username" = (select "username" from "users" where "color" = $1)');
        assert.deepEqual(result.bindings, ['accounts.color']);
      });
    });

    describe('used as table sub query', function() {
      it('should generate a valid query when used as a value in a FROM with an AS alias', function() {
        var tree = analyze({
          select: ['name', 'age'],
          from: {
            select: ['age'],
            from: 'users',
            where: {
              and: [
                {
                  age: 21
                }
              ]
            },
            as: 'userage'
          }
        });

        var result = Sequelizer(tree);
        assert.equal(result.sql, 'select "name", "age" from (select "age" from "users" where "age" = $1) as "userage"');
        assert.deepEqual(result.bindings, [21]);
      });
    });
  });
});
