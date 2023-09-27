const db = require('../Models')
// const {Sequelize, DataTypes} = require('sequelize')
// const Op = Sequelize.Op;

const Booking = db.bookings
const Room = db.rooms
const User = db.users
const Availability = db.availabilities
const Review = db.reviews

var count = 0

// function count(){
//   count++
// }

// useful functions
mmultiply = (a, b) => a.map(x => transpose(b).map(y => dotproduct(x, y)));
dotproduct = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
transpose = a => a[0].map((x, i) => a.map(y => y[i]));
line = (a,i) => a[i]
column = (a,i) => a.map(function(value,index) { return value[i]; });

// matrix factorization

var MF = function (R,P,Q,steps=4000,l=0.0002,min_error=1) {
    // maybe generate initial P,Q here and put k as parameter    
    let K=P[0].length // num of elements
    let eij=0
    for(let s=0;s<steps; s++){
      if(s%50==0)
      console.log(s)
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
          let total_error=0
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

  }

// Recommendations function


const getRecommendations = async(req,res)=>{
    let K =  5
    
    const rooms = await Room.findAll({       
        order: 
        [['id', 'ASC']]
    })
    let room_ids = rooms.map((room) => room.id)
    
    const users = await User.findAll({
        where:{isTenant:true},
        order: 
        [['id', 'ASC']]
    })
    let user_ids = users.map((user) => user.id)

    user_ids=user_ids.slice(0, 20);
    room_ids=room_ids.slice(0, 25);//fix this 

    console.log("user_ids",user_ids)
    let N=user_ids.length
    let M=room_ids.length
 
    user_index = u => {return user_ids.indexOf(u);}
    room_index = r => {return room_ids.indexOf(r);}
    
    R= new Array(N).fill(0).map(() => new Array(M).fill(0));
    
    const bookings = await Booking.findAll(
        {order: 
        [['userId', 'ASC'],['roomId', 'ASC']] //del
        }) // isos thelei ascending

    for(var b of bookings){
        let u=user_index(b.userId)
        let r=room_index(b.roomId)
        console.log(u,b.userId)
        console.log(r,b.roomId)
        R[u][r]=4.2
    }

    const reviews = await Review.findAll()

    for(var rev of reviews){
        let u=user_index(rev.userId)
        let r=room_index(rev.roomId)
        console.log(u, rev.userId)
        console.log(r, rev.roomId)
        R[u][r]=4.8
    }

    P=[]
    for(let i=0;i<N; i++){
    P.push(Array.from({length: K}, () => Math.random() ));
    }

    Q=[]
    for(let i=0;i<M; i++){
    Q.push(Array.from({length: K}, () => Math.random() ));
    }
    Q=transpose(Q)
    
    MF(R,P,Q)
    let pred= mmultiply(P,Q)
    console.log("pred",pred)
    let result_scores = pred[user_index( parseInt(req.params.userId,10) )]//put body.params.userId
//  
//

var result =[]
for(let i=0 ; i<M ; i++){ 
    result.push([room_ids[i],result_scores[i]])
    }

console.log(result)

// sort based on score (the second element)
result.sort(function(first, second) {
   return second[1] - first[1];
 });

// //result =result.slice(0, 3) //not mandatory

let res_rooms=[]
for (const [r,score] of result )
    res_rooms.push(r,score) 
//     // if r in booked {continue}  // !!! important
//     //else
//     // const Room = await findByPk(r) ;rooms.push[room];
    
    res.status(200).json({rooms: res_rooms})

}

module.exports = { getRecommendations };