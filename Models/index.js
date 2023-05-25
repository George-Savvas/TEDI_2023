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
db.dates = require('./DateModel.js')(sequelize, DataTypes)

db.users.hasMany(db.rooms, { as: "rooms" ,onDelete:"cascade"});

db.rooms.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});


db.rooms.belongsToMany(db.dates, { through: 'RoomDate' });
db.dates.belongsToMany(db.rooms, { through: 'RoomDate' });


///////////  DONE IN MYSQL - create the current next 500 dates //////////////
// const currDate = new Date();

// for(let i=0;i<500;i++){
//     currDate.setDate(currDate.getDate() + 1)
//     let Datekey = currDate.toJSON().slice(0,10)  // we give it the form of a DATE datatype (by keeping the first 10 characters)
//     const newDate=await db.dates.create({datekey:Datekey})
// }
    

db.sequelize.sync({force: false}).then(() => {
    console.log("Re-sync done")
})

module.exports = db
