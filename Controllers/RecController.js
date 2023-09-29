const db = require('../Models')
// const {Sequelize, DataTypes} = require('sequelize')
// const Op = Sequelize.Op;
//const Booking = db.bookings
const Room = db.rooms
// const User = db.users
// const Review = db.reviews
// const Search = db.searchHistories
// const Visit = db.visits

//const { db,a } = require('../Models/index.js');
//import MF_pred from "../Models/index.js";
// var P_global = require('../Models/index.js').P_global;
// var Q_global = require('../Models/index.js').Q_global;
// var user_ids = require('../Models/index.js').user_ids;
// var room_ids = require('../Models/index.js').room_ids;

// let P_global
// let Q_global
// let room_ids
// let user_ids

// user_index = u => {return user_ids.indexOf(u);}
// room_index = r => {return room_ids.indexOf(r);}


// // useful functions
// mmultiply = (a, b) => a.map(x => transpose(b).map(y => dotproduct(x, y)));
// dotproduct = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
// transpose = a => a[0].map((x, i) => a.map(y => y[i]));
// line = (a,i) => a[i]
// column = (a,i) => a.map(function(value,index) { return value[i]; });

// // matrix factorization

// var MF = function (R,P,Q,steps=3000,l=0.0002,min_error=1) {
//     // maybe generate initial P,Q here and put k as parameter    
//     let K=P[0].length // num of elements
//     let eij=0
//     let total_error=0
//     for(let s=0;s<steps; s++){
//       if(s%50==0)
//       console.log(s)
//       for(let i =0;i<R.length ;i++){
  
//           for(let j=0;j<R[0].length;j++){
              
//               // Change P,Q using GRADIENT DESCENT 
//               if(R[i][j] > 0){ // zero reprezent null values
              
//                   eij= R[i][j] - dotproduct(line(P,i),column(Q,j)) // mmultiply makes Q -> Q.T so the jth line becomes the jth column
//               }
  
//               for(let k=0; k<K ; k++){
//                   P[i][k]= P[i][k] + 2*l*eij*Q[k][j] // this comes from derivative (eij)^2
//                   Q[k][j] = Q[k][j] +   2*l*eij*P[i][k]  //  ... l added to make changes small
//               }
//               // END OF GRADIENT DESCENT
  
//       // CHECK WHETHER TOTAL ERROR REACHES MINIMUM_ERROR(0.001)
//           total_error=0
//           for(let i =0;i<R.length ;i++){
  
//               for(let j=0;j<R[0].length;j++){
//                   if(R[i][j] > 0)
//                   total_error+= Math.pow(R[i][j] - dotproduct(line(P,i),column(Q,j)),2)  // remember P and Q are now updated
//               }
//           }
  
//           if(total_error < min_error)
//               break;
      
//           }
//       }
  
    
//     }
//     return total_error
//   }

// // Recommendations function


// const createRecommendations = async(req,res)=>{
//     let K =  3
    
//     const rooms = await Room.findAll({       
//         order: 
//         [['id', 'ASC']]
//     })
//     room_ids = rooms.map((room) => room.id)
    
//     const users = await User.findAll({
//         where:{isTenant:true},
//         order: 
//         [['id', 'ASC']]
//     })
//     user_ids = users.map((user) => user.id)

//     // user_ids=user_ids.slice(0, 20);
//     // room_ids=room_ids.slice(0, 25);//fix this 

//     console.log("user_ids",user_ids)
//     let N=user_ids.length
//     let M=room_ids.length
     
//     R= new Array(N).fill(0).map(() => new Array(M).fill(0));

//     const bookings = await Booking.findAll() 

// // SCORE BY BOOKINGS
//     let booked_users = bookings.map(b => b.userId) // save which ids have bookings    
//     console.log(booked_users)
//     for(var b of bookings){
//         let u=user_index(b.userId)  // u is the user_ids index
//         let r=room_index(b.roomId)  // r is the room_ids index
//         console.log(u,b.userId)
//         console.log(r,b.roomId)
//         R[u][r]=3           // ADD SCORE , u and r give us the position in the R matrix
//     }

// // SCORE BY REVIEWS , OVERWRITE BOOKINGS
//     const reviews = await Review.findAll()

//     for(var rev of reviews){
//         let u=user_index(rev.userId)
//         let r=room_index(rev.roomId)
//         console.log(u, rev.userId)
//         console.log(r, rev.roomId)
//         R[u][r]=4 // reviews will overwrite previous score 
//     }

// for(var u_id of user_ids){
//     if(booked_users.includes(u_id))
//         continue  
//     else{
//     let u=user_index(u_id)
// // SEARCHES_SCORES 
//     const s = await Search.findOne({where:{userId:u_id}})
//     // assume it's never null since we have imported Airbnb dataset
//     // for(var s of searches){
//     //     let u=user_index(s.userId)  // for each searchHistory save the index of the userId as u
//     //                                 // each userId , roomId has its own index in R array 
//         if(s.cityId!=null){      
//             const temp_rooms= await Room.findAll( // find the room's with search's cityId 
//                 {where:{countryId: s.countryId,
//                     stateId: s.stateId ,
//                     cityId: s.cityId}} )

//             for(var t_room of temp_rooms){
//                 let r=room_index(t_room.id)         // save each roomId's index  
//                 console.log(" U r from Search:",u,r)
//                 R[u][r]=1.5 // give a score to the positions with u,r as indexes
 
//             }

//         }

//     //}

// // VISIT SCORES (OVERWRITE SEARCH SCORES)
//     const visits = await Visit.findAll({where: {userId:u_id}})
//     for(var v of visits){
//         let r=room_index(v.roomId)
//         console.log("userId U r from Visit:",v.userId,u,r)
//         if(v.count==1)
//             R[u][r]=1.8
//         else if(v.count==2)
//             R[u][r]=2.2
//         else    // count >=3
//             R[u][r]=3
//     }
//     }
// }

//     let P=[]
//     let Q=[]
//     for(let i=0;i<N; i++){
//     P.push(Array.from({length: K}, () => Math.random() ));
//     }

    
//     for(let i=0;i<M; i++){
//     Q.push(Array.from({length: K}, () => Math.random() ));
//     }
//     Q=transpose(Q)
    
//     console.time()
//     er=MF(R,P,Q,4000,0.0009,1)
//     console.log(er)
//     console.timeEnd()
//     P_global=P
//     Q_global=Q

//     let pred= mmultiply(P_global,Q_global)
//     console.log("pred",pred)
//     let result_scores = pred[user_index( parseInt(req.params.userId,10) )]//put body.params.userId
// //  
// //

// var result =[]
// for(let i=0 ; i<M ; i++){ 
//     result.push([room_ids[i],result_scores[i]])
//     }

// console.log(result)

// // sort based on score (the second element)
// result.sort(function(first, second) {
//    return second[1] - first[1];
//  });

// // //result =result.slice(0, 3) //not mandatory

// let res_rooms=[]
// for (const [r,score] of result )
//     res_rooms.push(r,score) 
// //     // if r in booked {continue}  // !!! important
// //     //else
// //     // const Room = await findByPk(r) ;rooms.push[room];
//     console.log("R",R)
//     res.status(200).json({rooms: res_rooms})

// }



const fs = require('fs')


const getRecommendations = async(req,res)=>{

  const path = 'MF.json'
  let pred
  let user_ids
  //let room_ids //del
  let rooms
  fs.readFile(path, 'utf8', (err, MFfile) => {
    if (err) {
        console.error('Error while reading the file:', err)
      return
      }
      try {
        const data = JSON.parse(MFfile)
        // output the parsed data
        pred=data.pred
        user_ids=data.user_ids
        console.log("uid",user_ids)
        // room_ids=data.room_ids  // del
        // console.log("room_ids",room_ids) // del
        rooms=data.rooms

        let result_scores = pred[user_ids.indexOf(parseInt(req.params.userId,10))]
        console.log(result_scores)
        //
        
        var result =[]
        for(let i=0 ; i<rooms.length ; i++){ 
            result.push([rooms[i],result_scores[i]])
        }  // result is an array of room and score couples , specifically for the current user 
        
        
        // sort based on score (the second element)
        result.sort(function(first, second) {
            return second[1] - first[1];
        });
        
        let ordered_rooms=[]
        for(const [r,score] of result)
            ordered_rooms.push(r)
        
        console.log("result",result)
        res.status(200).json({rooms: ordered_rooms})

        //const room = await Room.findByPk(1)
        // //result =result.slice(0, 3) //not mandatory
                
      } 
      
      catch (err) {
        res.status(200).json({rooms: []})
        console.error('Error while parsing JSON data:', err)
      }

    })

}
    //.then((result)=>res.status(200).json({NOtrooms: result}))
    
    //     (result)=>    { 
    //     let res_ids=[]
    //     for (const [r,score] of result ){
    //        //res_rooms.push(r,score) 
    // //     // if r in booked {continue}  // !!! important
    // //     //else
    //        res_ids.push(r) 
    //     }
    //     return res_ids})
    //     .then( (out)=> res.status(200).json({rooms: out}) )
    //     .then(console.log("saf"))
        // .then(
        //     (res_ids)=>
        //     { 
        //     async function getRoom(r) { // <-- async keyword here
        //         return (await Room.findbyPk(r)); // <-- await can be used inside
        //         }
        //     }// a list is created with the correct order)}

        // ).then((res)=>console.log("rooms",res))
        // .then( (out)=> res.status(200).json({rooms: out}) )
    

//   if(user_ids!=null && P_global!=null && Q_global!=null 
//         && user_ids.includes( parseInt(req.params.userId,10) )){ 
    
//     let pred= mmultiply(P_global,Q_global)
//     console.log("pred",pred)
    //user_index = u => {return user_ids.indexOf(u);}
    //room_index = r => {return room_ids.indexOf(r);}

//     let result_scores = pred[user_ids.indexOf(req.params.userId)]//parseInt(req.params.userId,10)
// //  
// //

//     var result =[]
//     for(let i=0 ; i<room_ids.length ; i++){ 
//         result.push([room_ids[i],result_scores[i]])
//     }  // result is an array of room and score couples , specifically for the current user 


//     // sort based on score (the second element)
//     result.sort(function(first, second) {
//         return second[1] - first[1];
//     });

// // //result =result.slice(0, 3) //not mandatory

//     let res_rooms=[]
//     for (const [r,score] of result ){
//        //res_rooms.push(r,score) 
// //     // if r in booked {continue}  // !!! important
// //     //else
//         const room = await Room.findByPk(r) ;
//         res_rooms.push(room); // a list is created with the correct order
//     }
//     res.status(200).json({rooms: res_rooms})
// }
//   else
//     res.status(200).json({rooms: []})//pred[user_index(req.params.userId)]}) // del

// }

module.exports = { getRecommendations};//createRecommendations };