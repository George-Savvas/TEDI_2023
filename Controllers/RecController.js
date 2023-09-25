const db = require('../Models')
// const {Sequelize, DataTypes} = require('sequelize')
// const Op = Sequelize.Op;

const Booking = db.bookings
const Room = db.rooms
const User = db.users
const Availability = db.availabilities
const Review = db.reviews

var count = 0

function count(){
  count++
}

// useful functions
mmultiply = (a, b) => a.map(x => transpose(b).map(y => dotproduct(x, y)));
dotproduct = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
transpose = a => a[0].map((x, i) => a.map(y => y[i]));
line = (a,i) => a[i]
column = (a,i) => a.map(function(value,index) { return value[i]; });



const getRecommendations = async(req,res)=>{
    const rooms = await Room.findAll({       
        order: 
        [['id', 'ASC']]
    })
    let room_ids = rooms.map((room) => room.id)
    
    const users = await User.findAll({
        order: 
        [['id', 'ASC']]
    })
    let user_ids = users.map((user) => user.id)
    
    let N=user_ids.length
    let M=room_ids.length
    
  
    R= new Array(N).fill(0).map(() => new Array(M).fill(0));
    
    console.log(room_ids[1],user_ids[0])
    for(let i=0 ;i < N ;i++){
        for(let j=0 ;i < M ;j++){
            const booking= await Booking.findOne({where: {roomId:room_ids[j],userId:user_ids[i]}})             
            if( booking )
                R[i][j]=5
            //if(booking rooms[j],users[i]-> R[i][j]=4 )
       }
    }    
    
    // }
    //R =
    res.status(200).json({message: N})
}

module.exports = { getRecommendations };