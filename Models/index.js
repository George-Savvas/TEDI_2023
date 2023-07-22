const databaseConfig = require('../DatabaseConfig.js')
const {Sequelize, DataTypes} = require('sequelize')
const bcrypt = require("bcrypt")

const sequelize = new Sequelize(
    databaseConfig.db,
    databaseConfig.user,
    databaseConfig.pass,
    {
        host: databaseConfig.host,
        dialect: databaseConfig.dialect,
        operatorsAliases: 0,
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
db.availabilities = require('./AvailabilityModel.js')(sequelize, DataTypes)
db.bookings = require('./BookingModel.js')(sequelize, DataTypes)

//Associations

// a user has many rooms
db.users.hasMany(db.rooms, {   
    foreignKey: "userId",
    sourceKey: "id",
    onDelete:"cascade"
});

db.rooms.belongsTo(db.users, {
  foreignKey: "userId",
  targetKey: "id",
});

// a room has many "availabilities"(dates either available or taken)
/* */
db.rooms.hasMany(db.availabilities, {   
    foreignKey: "roomId",
    sourceKey: "id",
    onDelete:"cascade"
});

db.availabilities.belongsTo(db.rooms, {
  foreignKey: "roomId",
  targetKey: "id",
});

// a user has many Bookings
db.users.hasMany(db.bookings, {   
    foreignKey: "userId",
    sourceKey: "id",
    onDelete:"cascade"
});

db.bookings.belongsTo(db.users, {
  foreignKey: "userId",
  targetKey: "id",
});

// a room has many Bookings
/* */
db.rooms.hasMany(db.bookings, {   
    foreignKey: "roomId",
    sourceKey: "id",
    onDelete:"cascade"
});

db.bookings.belongsTo(db.rooms, {
  foreignKey: "roomId",
  targetKey: "id",
});

// Admin Creation

async function createAdmin() {
    //let admins=await db.users.findAll({where:{isAdmin:true}}) 
    //if(admins.length==0){ // cause we had to run Server multiple times 

      let Admin_password = "Admin123"
      bcrypt.hash(Admin_password,10).then((hash_password)=>{
        db.users.create(
        {
        username: "Admin",
        password: hash_password, // all passwords are hashed for safety
        name: "John",
        lastname: "Wick",
        email: "housing_Admin@gmail.com",
        telephone: 6256699675, //maybe fix this(for the additional +30 at the start)
        active: true,
        isTenant: false,  // depends
        isLandlord: false, // depends
        isAdmin: true
        })
      })  
    //}
}

createAdmin()

   /* 
// test how Dates work
var dates = new Array();
const currDate=new Date('2023-07-20')   
const endDate=new Date('2023-07-25')
while(currDate<endDate){
    //console.log(currDate)
    //currDate.setDate(currDate + 1)
    currDate.setDate(currDate.getDate() + 1)
    dates.push(currDate.toJSON().slice(0,10))
}
console.log(dates)

/* */


db.sequelize.sync({force: false}).then(() => {
    console.log("Re-sync done")
})

module.exports = db
