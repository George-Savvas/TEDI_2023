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
/* 
  
db.rooms.hasMany(db.availabilities, {
    foreignKey: 'id'
  });
db.availabilities.belongsTo(db.rooms);
/* */  
  

// Admin Creation


/* */
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


/*  add it to 

async function getDates() {
    let dates_result=await db.dates.findAll()
    //.then(console.log("dates :",dates_result.length))
    //console.log("dates :",dates_result.length)
    if(dates_result.length == 0){

        //create the current next 500 dates //////////////
        const currDate = new Date()//.setHours(0, 0, 0, 0);
        
        for(let i=0;i<365;i++){
            currDate.setDate(currDate.getDate() + 1)
        
            let Datekey = currDate.toJSON().slice(0,10)  // we give it the form of a DATE datatype (by keeping the first 10 characters)
           
            Calendar = await db.calendars.create({datekey:Datekey}) // the first 365 dates - creation is a one time thing
                                            // it takes very small time so there is no problem doing it sychronously
            // asychronously: (+other changes) const newDate=await db.dates.create({datekey:Datekey})
        
            //////  !!!!!!!!!!!!!!!check asychronous method
        
        }
        }
    }

getDates()

   
    
/* */
db.sequelize.sync({force: false}).then(() => {
    console.log("Re-sync done")
})

module.exports = db
