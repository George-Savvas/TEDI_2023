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
            max: databaseConfig.pool.max,
            min: databaseConfig.pool.min,
            acquire: databaseConfig.pool.acquire,
            idle: databaseConfig.pool.idle
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
db.images = require('./ImageModel.js')(sequelize, DataTypes)
db.availabilities = require('./AvailabilityModel.js')(sequelize, DataTypes)
db.bookings = require('./BookingModel.js')(sequelize, DataTypes)
db.reviews = require('./ReviewModel.js')(sequelize, DataTypes)
db.searchHistories = require('./SearchHistoryModel.js')(sequelize, DataTypes)
db.visits = require('./VisitModel.js')(sequelize, DataTypes)
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

// a user has one SearchHistory 

db.users.hasOne(db.searchHistories, {   
  foreignKey: "userId",
  sourceKey: "id",
  onDelete:"cascade"
});

db.searchHistories.belongsTo(db.users, {
foreignKey: "userId",
targetKey: "id",
});

// a user has many Visits
db.users.hasMany(db.visits, {   
  foreignKey: "userId",
  sourceKey: "id",
  onDelete:"cascade"
});

db.visits.belongsTo(db.users, {
foreignKey: "userId",
targetKey: "id",
});

// a user has many Reviews
db.users.hasMany(db.reviews, {   
  foreignKey: "userId",
  sourceKey: "id",
  onDelete:"cascade"
});

db.reviews.belongsTo(db.users, {
foreignKey: "userId",
targetKey: "id",
});


// ASSOCIATIONS WITH ROOMS


// a room has many images (excluding the thumbnail )
/* */
db.rooms.hasMany(db.images, {   
  foreignKey: "roomId",
  sourceKey: "id",
  onDelete:"cascade"
});

db.images.belongsTo(db.rooms, {
foreignKey: "roomId",
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

// a room has many Reviews

db.rooms.hasMany(db.reviews, {   
  foreignKey: "roomId",
  sourceKey: "id",
  onDelete:"cascade",
});

db.reviews.belongsTo(db.rooms, {
foreignKey: "roomId",
targetKey: "id",
});

// a room has many Visits

db.rooms.hasMany(db.visits, {   
  foreignKey: "roomId",
  sourceKey: "id",
  onDelete:"cascade",
});

db.visits.belongsTo(db.rooms, {
foreignKey: "roomId",
targetKey: "id",
});
/* */

//Admin Creation
async function createAdmin() {

      let Admin_password = "Admin123"
      bcrypt.hash(Admin_password,10).then((hash_password)=>{
        db.users.create(
        {
        username: "Admin",
        password: hash_password, // all passwords are hashed for safety
        name: "John",
        lastname: "Wick",
        email: "housing_Admin@gmail.com",
        telephone: 6256999675, //maybe fix this(for the additional +30 at the start)
        active: true,
        isTenant: false,  // depends
        isLandlord: false, // depends
        isAdmin: true
        })
      })  
      
}

//  SYNCHRONISE WITH MYSQL 
db.sequelize.sync({force: false}).then(() => {
    console.log("Re-sync done")
})

//  CREATE ADMIN 
  .then(
    (res)=> db.users.findAll({where:{isAdmin:true}})  // check if he already exists
  ).then(
    (users)=>users.length
  ).then(
    (length)=>{
    if(length==0)                                    // if not , create him
      createAdmin()
    }
  )

// let cur= db.users.findAll()//{where:{isAdmin:true}})
// .then((users)=>console.log(users.length))


//console.log("users",db.users.length)

module.exports = db