const databaseConfig = require('../DatabaseConfig.js')
const {Sequelize, DataTypes} = require('sequelize')
const bcrypt = require("bcrypt")
const Op = Sequelize.Op;
const fs = require('fs');

// set up configuration
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

// require tables
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

//!!! Associations  !!!!

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
        name: "Theodosis",
        lastname: "Theodosiou",
        email: "admin@housingeasy.com",
        telephone: 6981828384, //maybe fix this(for the additional +30 at the start)
        active: true,
        isTenant: false,  // depends
        isLandlord: false, // depends
        isAdmin: true
        })
      })  
      
}

// global variables
let P_global
let Q_global
let room_ids
let user_ids

// useful functions
mmultiply = (a, b) => a.map(x => transpose(b).map(y => dotproduct(x, y)));
dotproduct = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
transpose = a => a[0].map((x, i) => a.map(y => y[i]));
line = (a,i) => a[i]
column = (a,i) => a.map(function(value,index) { return value[i]; });

// matrix factorization

var MF = function (R,P,Q,steps=3000,l=0.0002,min_error=1) {
    // maybe generate initial P,Q here and put k as parameter    
    let K=P[0].length // num of elements
    let eij=0
    let total_error=0
    for(let s=0;s<steps; s++){
      if(s%50==0)
      console.log("MF : %d steps",s)
      for(let i =0;i<R.length ;i++){
  
          for(let j=0;j<R[0].length;j++){
              
              // Change P,Q using GRADIENT DESCENT 
              if(R[i][j] > 0){ // zero reprezent null values
              
                  eij= R[i][j] - dotproduct(line(P,i),column(Q,j)) // mmultiply makes Q -> Q.T so the jth line becomes the jth column
              }
  
              for(let k=0; k<K ; k++){
                  P[i][k]= P[i][k] + 2*l*eij*Q[k][j] // this comes from derivative (eij)^2
                  Q[k][j] = Q[k][j] +   2*l*eij*P[i][k]  //  ... l added to make changes small
              }
              // END OF GRADIENT DESCENT
  
      // CHECK WHETHER TOTAL ERROR REACHES MINIMUM_ERROR(0.001)
          total_error=0
          for(let i =0;i<R.length ;i++){
  
              for(let j=0;j<R[0].length;j++){
                  if(R[i][j] > 0)
                  total_error+= Math.pow(R[i][j] - dotproduct(line(P,i),column(Q,j)),2)  // remember P and Q are now updated
              }
          }
  
          if(total_error < min_error)
              break;
      
          }
      }
  
    
    }
    console.log("total error",total_error)
    return total_error
  }

// Recommendations function


const createRecommendations = async()=>{
    let K =  3
    
    const rooms = await db.rooms.findAll()
    room_ids = rooms.map((room) => room.id)
    
    const users = await db.users.findAll({
        where:{isTenant:true}
    })
    user_ids = users.map((user) => user.id)

    // user_ids=user_ids.slice(0, 20);
    // room_ids=room_ids.slice(0, 25);//fix this 

    let N=user_ids.length
    let M=room_ids.length
     
    R= new Array(N).fill(0).map(() => new Array(M).fill(0));

    const bookings = await db.bookings.findAll() 
    user_index = u => {return user_ids.indexOf(u);}
    room_index = r => {return room_ids.indexOf(r);}
// SCORE BY BOOKINGS
    let users_with_book = bookings.map(b => b.userId) // save which ids have bookings    
    
    if(bookings !==null){
    for(var b of bookings){
      let u=user_index(b.userId)  // u is the user_ids index
      let r=room_index(b.roomId)  // r is the room_ids index
 
        R[u][r]=3           // ADD SCORE , u and r give us the position in the R matrix
    }}

// SCORE BY REVIEWS , OVERWRITE BOOKINGS
    const reviews = await db.reviews.findAll()
    let users_with_review = reviews.map(r => r.userId) 

    if(reviews){
    for(var rev of reviews){
        let u=user_index(rev.userId)  
        let r=room_index(rev.roomId)
        R[u][r]=4 // reviews will overwrite previous booking score 
    }}

for(var u_id of user_ids){
    if(users_with_book.includes(u_id) || users_with_review.includes(u_id))
        continue  
    else{
    let u=user_index(u_id)
// SEARCHES_SCORES 
    const s = await db.searchHistories.findOne({where:{userId:u_id}})
    
    if(s!=null){
        if(s.cityId!=null){      
            const temp_rooms= await db.rooms.findAll( // find the room's with search's cityId 
                {where:{countryId: s.countryId,
                    stateId: s.stateId ,
                    cityId: s.cityId}} )

            for(var t_room of temp_rooms){
                let r=room_index(t_room.id)         // save each roomId's index  
                R[u][r]=1.5 // give a score to the positions with u,r as indexes
 
            }

        }

    }

// VISIT SCORES (OVERWRITE SEARCH SCORES)
    const visits = await db.visits.findAll({where: {userId:u_id}})
    
    if(visits!=null){
    for(var v of visits){
        let r=room_index(v.roomId)
        if(v.count==1)
            R[u][r]=1.8
        else if(v.count==2)
            R[u][r]=2.2
        else    // count >=3
            R[u][r]=2.6
    }}
    
  }
}
    console.log("R",R)
    let P=[]
    let Q=[]
    for(let i=0;i<N; i++){
    P.push(Array.from({length: K}, () => Math.random() ));
    }

    
    for(let i=0;i<M; i++){
    Q.push(Array.from({length: K}, () => Math.random() ));
    }
    Q=transpose(Q)
    
    console.time()
    er=MF(R,P,Q,4000,0.0009,1)
    console.timeEnd()
    P_global=P
    Q_global=Q

    let pred= mmultiply(P_global,Q_global)
    console.log("pred",pred) //del

  var jsonObj = {pred:pred, user_ids:user_ids , rooms:rooms}//,rooms:rooms}

  return jsonObj
}


//  SYNCHRONISE WITH MYSQL 
db.sequelize.sync({force: false}).then(() => {
    console.log("Re-sync done")
})

// ..then
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

// ..then
// CREATE PASSWORDS FOR AIRBNB DATASET TENANTS
  .then(
    (r)=>
    db.users.findAll(
      {where:
        {isTenant:true //,
        //createdAt:{
        //  [Op.lt]: new Date('2023-08-13')
        //} 
      }})
    ).then(
      (tenants)=>tenants.length
    ).then(
      (len)=> {
      
        if(len<1)
        {
          console.log("!!!!!   Fake Tenants need to be imported     !!!!!!!")
          return 0
        }

        else {
          return 1
        }
      }).then(
        (data_imported)=> 
        {

        if( data_imported===0)
          console.log("Tenants are imported!")
        else {
         bcrypt.hash("123456",10)
          .then(
          (pass)=>
          db.users.update(
            {password:pass},
            {where:
              {isTenant:true ,
              updatedAt:{
              [Op.lt]: new Date('2023-08-13') // update all non-updated fake tenants with the same password 
              } 
          }})
      )
// ..then
// RUN MATRIX FACTORIZATION
  .then((res)=>
    createRecommendations() //run MF
  ).then((RecObj)=>JSON.stringify(RecObj))
  .then( 
    (Rec_jsonContent)=>{ // write the result to a file 
      fs.writeFile("MF.json", Rec_jsonContent, 'utf8', function (err) {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
      }
 
      console.log("MF.json file has been saved.");
  });
})
} 

})
module.exports = db


