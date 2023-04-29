const databaseConfig = require('../DatabaseConfig.js')
const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(
    databaseConfig.db,
    databaseConfig.user,
    databaseConfig.pass,
    {
        host: databaseConfig.host,
        dialect: databaseConfig.dialect,
        operatorsAliases: false,
        pool: {
            max: databaseConfig.max,
            min: databaseConfig.min,
            acquire: databaseConfig.acquire,
            idle: databaseConfig.idle
        }
    }
)

sequelize.authenticate().then(() => {
    console.log("Connected")
}).catch(error => {
    console.log("Error: ", error)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize
db.users = require('./UserModel.js')(sequelize, DataTypes)
db.rooms = require('./RoomModel.js')(sequelize, DataTypes)

db.users.hasMany(db.rooms, { as: "rooms" ,onDelete:"cascade"});

db.rooms.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

db.sequelize.sync({force: false}).then(() => {
    console.log("Re-sync done")
})

module.exports = db
