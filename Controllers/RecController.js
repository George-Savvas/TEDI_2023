const db = require('../Models')

const Room = db.rooms




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
        //console.log("uid",user_ids)
        // room_ids=data.room_ids  // del
        // console.log("room_ids",room_ids) // del
        rooms=data.rooms

        let result_scores = pred[user_ids.indexOf(parseInt(req.params.userId,10))]
        console.log(" User's row in MF matrix ",result_scores)
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
        
        //console.log("result",result)
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