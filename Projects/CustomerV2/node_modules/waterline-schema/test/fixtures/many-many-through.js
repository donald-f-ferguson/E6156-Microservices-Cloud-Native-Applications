module.exports = [

  {
    connection: 'f',
    identity: 'user',
    tableName: 'user',
    migrate: 'alter',
    attributes: {
      cars: {
        collection: 'car',
        through: 'drive',
        via: 'user'
      }
    }
  },

  {
    connection: 'f',
    identity: 'drive',
    tableName: 'drive',
    migrate: 'alter',
    attributes: {
      car: {
        model: 'car'
      },
      user: {
        model: 'user'
      }
    }
  },

  {
    connection: 'f',
    identity: 'car',
    tableName: 'car',
    migrate: 'alter',
    attributes: {
      drivers: {
        collection: 'user',
        through: 'drive',
        via: 'car'
      }
    }
  }


];
