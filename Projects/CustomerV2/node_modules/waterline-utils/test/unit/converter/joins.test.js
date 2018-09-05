var Test = require('../../support/convert-runner');

describe('Converter :: ', function() {
  describe('Using Cursor Instructions (for single query situations) :: ', function() {
    describe('With Strategy 1 :: ', function() {
      it('should generate a find query with a left outer join', function() {
        Test({
          criteria: {
            model: 'user',
            method: 'find',
            criteria: {
              // Parent Criteria
              where: {
                type: 'beta user'
              },
              sort: [
                {
                  amount: 'DESC'
                }
              ]
            }
          },
          // Join Instructions
          joins: [
            {
              strategy: {
                strategy: 1,
                meta: {
                  parentFK: 'pet_id'
                }
              },
              instructions: [
                {
                  parent: 'user',
                  parentAlias: 'user__pet',
                  parentKey: 'pet_id',
                  child: 'pet',
                  childAlias: 'pet__pet',
                  childKey: 'id',
                  alias: 'pet',
                  removeParentKey: true,
                  model: true,
                  collection: false,
                  criteria: {
                    select: ['id', 'name', 'breed']
                  }
                }
              ]
            }
          ],
          query: {
            select: ['pet__pet.id as pet__id', 'pet__pet.name as pet__name', 'pet__pet.breed as pet__breed'],
            from: 'user',
            orderBy: [
              {
                amount: 'DESC'
              }
            ],
            where: {
              type: 'beta user'
            },
            leftOuterJoin: [
              {
                from: 'pet as pet__pet',
                on: {
                  user: 'pet_id',
                  'pet__pet': 'id'
                }
              }
            ]
          }
        });
      });
    });

    describe('With Strategy 2 :: ', function() {
      it('should generate a find query with a left outer join', function() {
        Test({
          criteria: {
            model: 'user',
            method: 'find',
            criteria: {
              // Parent Criteria
              where: {
                type: 'beta user'
              },
              sort: [
                {
                  amount: 'DESC'
                }
              ],
              select: []
            }
          },
          // Join Instructions
          joins: [
            {
              strategy: {
                strategy: 2,
                meta: {
                  childFK: 'user_id'
                }
              },
              instructions: [
                {
                  parent: 'user',
                  parentAlias: 'user__pets',
                  parentKey: 'id',
                  child: 'pet',
                  childAlias: 'pet__pets',
                  childKey: 'user_id',
                  alias: 'pets',
                  removeParentKey: true,
                  model: false,
                  collection: true,
                  criteria: {
                    select: ['id', 'name', 'breed', 'user_id']
                  }
                }
              ]
            }
          ],
          query: {
            select: ['pet__pets.id as pets__id', 'pet__pets.name as pets__name', 'pet__pets.breed as pets__breed', 'pet__pets.user_id as pets__user_id'],
            from: 'user',
            orderBy: [
              {
                amount: 'DESC'
              }
            ],
            where: {
              type: 'beta user'
            },
            leftOuterJoin: [
              {
                from: 'pet as pet__pets',
                on: {
                  user: 'id',
                  'pet__pets': 'user_id'
                }
              }
            ]
          }
        });
      });
    });

    describe('With Strategy 3 :: ', function() {
      it('should generate a find query with a two left outer join clauses', function() {
        Test({
          criteria: {
            model: 'user',
            method: 'find',
            criteria: {
              // Parent Criteria
              where: {
                type: 'beta user'
              },
              sort: [
                {
                  amount: 'DESC'
                }
              ]
            }
          },
          // Join Instructions
          joins: [
            {
              strategy: {
                strategy: 3,
                meta: {
                  junctorIdentity: 'user_pets__pets_users',
                  junctorPK: 'id',
                  junctorFKToParent: 'user_pets',
                  junctorFKToChild: 'pet_users'
                }
              },
              instructions: [
                {
                  parent: 'user',
                  parentAlias: 'user__pets',
                  parentKey: 'id',
                  child: 'user_pets__pets_users',
                  childAlias: 'user_pets__pets_users__pets',
                  childKey: 'user_pets',
                  alias: 'pets',
                  removeParentKey: false,
                  model: false,
                  collection: true
                },
                {
                  parent: 'user_pets__pets_users',
                  parentAlias: 'user_pets__pets_users__pets',
                  parentKey: 'pet_users',
                  child: 'pet',
                  childAlias: 'pet_pets',
                  childKey: 'id',
                  alias: 'pets',
                  removeParentKey: false,
                  model: false,
                  collection: true,
                  criteria: {
                    select: ['id', 'name', 'breed']
                  }
                }
              ]
            }
          ],
          query: {
            select: ['pet_pets.id as pets__id', 'pet_pets.name as pets__name', 'pet_pets.breed as pets__breed'],
            from: 'user',
            orderBy: [
              {
                amount: 'DESC'
              }
            ],
            where: {
              type: 'beta user'
            },
            leftOuterJoin: [
              {
                from: 'user_pets__pets_users as user_pets__pets_users__pets',
                on: {
                  user: 'id',
                  'user_pets__pets_users__pets': 'user_pets'
                }
              },
              {
                from: 'pet as pet_pets',
                on: {
                  'pet_pets': 'id',
                  'user_pets__pets_users__pets': 'pet_users'
                }
              }
            ]
          }
        });
      });
    });
  });
});
