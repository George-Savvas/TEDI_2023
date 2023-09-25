const db = require('../Models')
const func = require("./func");
const {Sequelize, DataTypes} = require('sequelize')
const Op = Sequelize.Op;
const Room = db.rooms
const Availability = db.availabilities
const Image = db.images

const multer = require("multer");
const fs = require('fs');

const storageEngine = multer.diskStorage({
    destination: "./images",
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}--${file.originalname}`);
    },
  });

const path = require("path");

const checkFileType = function (file, cb) {
    //Allowed file extensions
    const fileTypes = /jpeg|jpg|png|gif|svg/;
  
    //check extension names
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  
    const mimeType = fileTypes.test(file.mimetype);
  
    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb("Error: You can Only Upload Images!!");
    }
  };

const upload = multer({
    storage: storageEngine,
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb);
    },
  })//.single('thumbnail_img');

const upload_thumbnail= upload.single('thumbnail_img');

const upload_profile= upload.single('profile_img');

const upload_images= upload.array('images');



const addRoom = async (req,res) => {
    
    let RoomInfo = {
        //id: req.body.id,
        name: req.body.name,
        heating: req.body.heating,
        description: req.body.description,
        userId: req.body.userId,
        openStreetMapX:req.body.openStreetMapX,
        openStreetMapY: req.body.openStreetMapY,
        openStreetMapLabel: req.body.openStreetMapLabel,

        country:req.body.country,
        address: req.body.address,
        accessibilityToMeansOfTransport: req.body.accessibilityToMeansOfTransport,
        numOfPeople: req.body.numOfPeople,
        maxNumOfPeople: req.body.maxNumOfPeople,
        cost: req.body.cost,
        //additionalCostPerPerson: req.body.additionalCostPerPerson, // see if bellow 
        roomType: req.body.roomType,
        rules: req.body.rules,
        numOfBeds: req.body.numOfBeds,
        numOfBathrooms: req.body.numOfBathrooms,
        numOfBedrooms: req.body.numOfBedrooms ,
        livingRoomInfo: req.body.livingRoomInfo,
        roomArea: req.body.roomArea,
        countryId: req.body.countryId,
        stateId: req.body.stateId,
        cityId: req.body.cityId
    }

    if(req.body.additionalCostPerPerson)
        RoomInfo["additionalCostPerPerson"]=req.body.additionalCostPerPerson
    else
        RoomInfo["additionalCostPerPerson"]=0

    if(req.file) // if thumbnail is to be updated
    {
        // add new thumbnail path to RoomInfo 
        RoomInfo["thumbnail_img"] = req.file.path
    }
    // else 
    //     console.log("no file")

    try {
      const room = await Room.create(RoomInfo)
      
      console.log(req.body.InDate,req.body.OutDate,room.id)
      func.set_avail_dates_func(req.body.InDate,req.body.OutDate,room.id)

      
      res.status(200).json({room: room})
      //console.log(room)
    }catch(error) {
       res.status(400).send(error);
    }
    
}

// images (except for thumbnail)

const addImages = async (req,res) => {
    let RoomId= req.params.roomId
    let paths = req.files.map(file => file.path)
    console.log("all paths:",paths)
    let index = 0

    while(index < paths.length ){
        await Image.create(
            {roomId:RoomId,
            path:paths[index],
            position:index+1
            })

        index++
    }

    res.status(200).json({message: `Added ${index} Images`})
}

const getImages = async (req,res) => {
    let RoomId= req.params.roomId
    
    const images =await Image.findAll({
        //attributes: ['path','position'], //del
        where: {roomId:RoomId}
        })

    console.log(images)//del
    res.status(200).json({images:images})
}

const getImageByPath = async (req,res) => {
    
    const image =await Image.findOne({
        where: {path:req.body.path}
        })

    res.status(200).json({image:image})
}

const deleteImage = async (req,res) => {
    let Id= req.params.id

    // unlink image form ./images
    const image =await Image.findByPk(Id) 
    if(!image) {
        res.status(200).json({message:"Image not found"})
    }
    else {
        img_path =image.path
        fs.unlink(img_path, function(err) {
            if (err) {
                console.error("Error occurred while trying to remove image");
            } 
          });

        // destroy image record
        await Image.destroy({
            where: {id:Id}
            })

        res.status(200).json({message:"Image deleted succesfully"})
    }
}


///////////////////////////

const getAllRooms = async (req,res) => {
    let rooms = await Room.findAll()
    res.status(200).json({rooms: rooms})
}

const getRoomById = async(req,res) => {    
    let Id=req.params.id
    let room=await Room.findByPk(Id)
    res.status(200).json({room: room})
}

const getUserRooms = async (req,res) => {
    let UserId=req.params.userId
    let rooms = await Room.findAll({where:{userId:UserId}})
    res.status(200).json({rooms: rooms})
}

const updateRoom = async(req,res) => {
    let Id=req.params.id
    
    let RoomInfo={   
        //id: req.body.id,
        name: req.body.name,
        // location: req.body.location,
        // area: req.body.area,
        heating: req.body.heating,
        description: req.body.description,        
        userId: req.body.userId,
        openStreetMapX:req.body.openStreetMapX,
        openStreetMapY: req.body.openStreetMapY,
        openStreetMapLabel: req.body.openStreetMapLabel,
        // country:req.body.country,
        address: req.body.address,
        accessibilityToMeansOfTransport: req.body.accessibilityToMeansOfTransport,
        numOfPeople: req.body.numOfPeople,
        maxNumOfPeople: req.body.maxNumOfPeople,
        cost: req.body.cost,
        additionalCostPerPerson: req.body.additionalCostPerPerson,
        roomType: req.body.roomType,
        rules: req.body.rules,
        numOfBeds: req.body.numOfBeds,
        numOfBathrooms: req.body.numOfBathrooms,
        numOfBedrooms: req.body.numOfBedrooms ,
        livingRoomInfo: req.body.livingRoomInfo,
        roomArea: req.body.roomArea,
        countryId: req.body.countryId,
        stateId: req.body.stateId,
        cityId: req.body.cityId
    }

    if(req.file  ) // if thumbnail is to be replaced/added
    {
        // add new thumbnail path to RoomInfo 
        RoomInfo["thumbnail_img"] = req.file.path
        
        // remove old thumbnail from storage 
        const room =await Room.findByPk(Id,{attributes:["thumbnail_img"]}) 
        img_path = room.thumbnail_img
        
        
        if(img_path){
        fs.unlink(img_path, function(err) {
            if (err) {
            console.error("Error occurred while trying to remove image");
            } 
        });
    }
    }
    
    await Room.update(
        RoomInfo,
        {where: {id: Id}}
        )
    res.status(200).json({message: "Information updated succesfully!"})
}

const noThumbnail = async(req,res) =>{ //if landlord wants to drop thumb_nail_img
    Id=req.params.id

    //remove from storage
    const room =await Room.findByPk(Id,{attributes:["thumbnail_img"]}) 
        img_path = room.thumbnail_img
        
        
        if(img_path){
            fs.unlink(img_path, function(err) {
                if (err) {
                console.error("Error occurred while trying to remove image");
                } 
            });
        }

    //remove from room's columns
    await Room.update(
        {thumbnail_img:null},
        {where: {id: Id}}
        )
        res.status(200).json({message: "Thumbnail removed succesfully!"})   
}


const sql =require('@sequelize/core');



const getAvailableRoomsByFilters = async(req,res) =>{

//  ESSENTIAL KEYS : numberOfpeople , Dates 

    let NumOfPeople= req.body.numOfPeople
    let InDate=new Date(req.body.InDate)
    let OutDate=new Date(req.body.OutDate)
    let SecondToLastDate= new Date(req.body.OutDate)
    SecondToLastDate.setDate(OutDate.getDate() - 1) 
    


//  ADD FILTERS IF THEY EXIST
    function addIfNotNull(key,value,Info){
        if(value)
            Info[key] = value            
    }

    let RoomInfo={}   // RoomInfo collects most of the filters

    RoomInfo["numOfPeople"] = {[Op.lte]:req.body.numOfPeople} // mandatory
    RoomInfo["maxNumOfPeople"] = {[Op.gte]:req.body.numOfPeople} //mandatory
    addIfNotNull("countryId",req.body.countryId,RoomInfo)
    addIfNotNull("cityId",req.body.cityId,RoomInfo)
    addIfNotNull("stateId",req.body.stateId,RoomInfo)
    addIfNotNull("heating",req.body.heating,RoomInfo)
    addIfNotNull("roomType",req.body.roomType,RoomInfo)
    addIfNotNull("numOfBeds",req.body.numOfBeds,RoomInfo)
    addIfNotNull("numOfBathrooms",req.body.numOfBathrooms,RoomInfo)
    addIfNotNull("numOfBedrooms",req.body.numOfBedrooms,RoomInfo)
    addIfNotNull("roomArea",req.body.roomArea,RoomInfo)
    addIfNotNull("countryId",req.body.countryId,RoomInfo)

// //  FIND ALL THE UNAVAILABLE ROOMS SATISFYING THE FILTERS

// //unavailable_rooms are those whose at least 1 day in [InDate,OutDate) is not available
//     const unavailable_rooms = await Room.findAll(
//         {

//         attributes: ['id'],
        
//         where:
//         {
//             [Op.and]:
//                 [
//                 RoomInfo,                
//                 {numOfPeople:{
//                     [Op.lte]: NumOfPeople
//                 }},
//                 {maxNumOfPeople:{        // NumPeople must be between the minimum and maximum
//                     [Op.gte]: NumOfPeople
//                 }}
//             ]
//         }
//         ,

//         include: { 
//                 model: Availability,
//                 where:{
//                     //roomId:{$col: 'Room.id'}, AVOID,happens automatically

//                     date:{
//                         [Op.lt]: OutDate,  // we leave OutDate available for a "check-in" date
//                         [Op.gte]: InDate
//                         },
                    
//                     available:false
//                 }
//             }
                
//         });

//     const unavailable_Ids = unavailable_rooms.map((un_room) => un_room.id);

//     const rooms = await Room.findAll(
//     {
//         where:{
//             [Op.and]:
//               [   
//                 {id:{[Op.notIn]:unavailable_Ids}}
//                 ,
//                 RoomInfo
//                 ,
//                 {numOfPeople:{
//                     [Op.lte]: NumOfPeople
//                 }},
//                 {maxNumOfPeople:{        // NumPeople must be between the minimum and maximum
//                     [Op.gte]: NumOfPeople
//                 }}
//               ]

//         },

//         include: [
//         {
//           model: Availability,
//           //required: true,
//           where:{ date:InDate ,available:true}
//         },
//         {
//           model: Availability,
//           //required: true,
//           where:{ date:SecondToLastDate} // Outdate can be unavailable, it's assumed check outs are before checkins of same day
//         }],

//         order: 
//             [['cost', 'ASC']]
//     })  // tot_cost= cost+ extra* ext_cost


        // const where1={
        //     [Op.and]:
        //       [   
        //         {id:{[Op.notIn]:unavailable_Ids}}
        //         ,
        //         RoomInfo
        //         ,
        //         {numOfPeople:{
        //             [Op.lte]: NumOfPeople
        //         }},
        //         {maxNumOfPeople:{        // NumPeople must be between the minimum and maximum
        //             [Op.gte]: NumOfPeople
        //         }}
        //     ]}

        
    //calculate days difference by dividing total milliseconds in a day  
    let num_of_dates = (OutDate.getTime() - InDate.getTime()) / (1000 * 60 * 60 * 24);
    let MaxCost= 1000000000000
    // If not null acquire maxCost  
    if(req.body.maxCost)
        MaxCost=req.body.maxCost

// FIND FILTERED ROOMS (APART FROM THEIR AVAILABILITY , MAXCOST)

const filtered_rooms = await Room.findAll({where:RoomInfo})
const filtered_Ids = filtered_rooms.map((room) => room.id);

//FIND AVAILABLE ROOMS 

//START OF QUERY 
// got to line !!! 441, we check availability by checking if number of availble dates is same as ${num_of_dates}()
    
const  [available_rooms, metadata] = await db.sequelize.query(    
`SELECT 
id,
name,
cost,
space,
heating,
description,
thumbnail_img,
num_of_images,
openStreetMapX,
openStreetMapY,
openStreetMapLabel,
countryId,
stateId,
cityId,
address,
accessibilityToMeansOfTransport,
numOfPeople,
maxNumOfPeople,
additionalCostPerPerson,
roomType,
rules,
numOfBeds,
numOfBathrooms,
numOfBedrooms,
livingRoomInfo,
roomArea,
userId,
${num_of_dates}*(cost+additionalCostPerPerson*(${NumOfPeople}-numOfPeople)) as total_cost 
    FROM rooms  
    where            
        id In (select roomId 
            FROM availabilities  
            where date >= ${JSON.stringify(req.body.InDate)} and date < ${JSON.stringify(req.body.OutDate)}
                and available=true
            group by roomId
            having count(*)=${num_of_dates}
            )
group by id
having total_cost < ${MaxCost}
ORDER BY total_cost;`     
    )  // It also filters maxCost because total_cost needed raw query to be estimated


let final_rooms=[]

for(const [key, avail_room] of Object.entries(available_rooms)){
        if(filtered_Ids.includes(avail_room.id))
            final_rooms.push(avail_room)
}

res.status(200).json({rooms: final_rooms})
    
}


const deleteRoom = async(req,res) => {
    let Id=req.params.id
    

    // DELETE IMAGES FROM './images' CLEAR SPACE 
    //1) DELETE thumbnail_img
    const room=await Room.findByPk(Id,{
        attributes: ['thumbnail_img']
        })
    
    if (room == null) {  // 1) CHECK IF ID IS INVALID
        res.status(200).json({message:"Room doesn't exist"});
        }
    
    else{
        const img_path=room.thumbnail_img    //const img_path = room.map((room) => room.thumbnail_img);
        if(img_path ){  // if thumbnail_img != NULL 
            fs.unlink(img_path, function(err) {
                if (err) {
                    console.error("Error occurred while trying to remove image");
                } 
            });
        }
        //2) DELETE IMAGES 
        const images = await Image.findAll({attributes: ['path'],where:{roomId:Id}})
        if(images ){ // if room has any images
            const paths = images.map((image) => image.path)
            console.log("paths",paths)
            for(let i=0;i<paths.length;i++){
                console.log("path:",path[i])
                fs.unlink(paths[i], function(err) {
                    if (err) {
                        console.error("Error occurred while trying to remove image");
                    } 
                  });
            }
        }
//////////////////////////////////    
/////   DELETE ROOM
        await Room.destroy({
            where: {
              id: Id
            }
        })
        res.status(200).json({message: "Room deleted succesfully!"})  
    }
}



//////////  AVAILABILITIES:

// const addAvailability = async (req,res) => {
//     let Info={
//         date: req.body.date,
//         available:true,
//         price: req.body.price,
//         roomId:req.body.roomId        
//     }
// /// periptosi na ypar hdh
//     const availability=await Availability.findOrCreate({where:Info})
//     res.status(200).json({availability:availability})
//     console.log(availability)
// }

const set_Availabilities = async (req,res) => {
    
    let OutDate = new Date(req.body.OutDate)
    OutDate.setDate(OutDate.getDate() + 1)
    let currDate = new Date(req.body.InDate)
    
    console.log(req.body.OutDate,OutDate)

    do {
    
        let Date = currDate.toJSON().slice(0,10)  // we give it the form of a DATE datatype (by keeping the first 10 characters)
        
        // check if availability already exists(then don't change anything because a booking may also exist) 
        let avail = await db.availabilities.findOne({where:{
            date: Date,
            roomId:req.params.roomId}}) 
        
        console.log("Date %s !",Date)
        // // if it doesn't exist create it with available:true
        if(avail==null){
            await db.availabilities.create({
                date: Date,
                available:true,
                //price: req.body.price,
                roomId:req.params.roomId})
        }

        currDate.setDate(currDate.getDate() + 1) // next day
    } while(currDate < OutDate) //maxDate

    res.status(200).json({message: "Availabilities added!"})
}

const changeAvailability = async(req,res) => {
    let RoomId =req.body.roomId
    let InDate = new Date(req.body.InDate)
    let OutDate = new Date(req.body.OutDate)
    let Available = req.body.available

    const availabilities=await Availability.update( // returns count because it is update
        {   
            available:Available
        },
        {where: {
            roomId: RoomId ,   // sequelize assumes we want op.AND when not specified
            date: {
                [Op.lt]: OutDate,  // we leave OutDate available for a "check-in" date
                [Op.gte]: InDate
              }
            }
        })

    res.status(200).json({availabilities: availabilities}) 
    }

const getAvailableDates = async(req,res) => {
    
    const availabilities = await Availability.findAll(
            {
    
            attributes: ['date','available'],
            
            where: {roomId: req.params.roomId},
    
            order: 
            [['date', 'ASC']]
            
            }
        )
    
        //const dates = Availabilities_true.map((avail) => avail.date)
        res.status(200).json({availabilities:availabilities })
        }    


const getAvailableDates1 = async(req,res) => {
    

    const Availabilities_true = await Availability.findAll(
        {

        attributes: ['date'],
        
        where: {roomId: req.params.roomId,available:true},

        order: 
        [['date', 'ASC']]
        
        }
    )

    const dates = Availabilities_true.map((avail) => avail.date)
    res.status(200).json({dates: dates})
    }

//////// maybe delete: /////////////////
const deleteDates= async(req,res) => {
    await Availability.destroy({
        where: {
            roomId:req.params.roomId 
        }
        //truncate: true
      })
      res.status(200).json({message: "All dates deleted succesfully!"})  
}


/* */
module.exports = {
    addRoom,
    getAllRooms,
    getRoomById,
    getUserRooms,
    getAvailableRoomsByFilters,
    updateRoom,
    noThumbnail,
    deleteRoom,
    set_Availabilities,
    //addAvailability,
    getAvailableDates,
    deleteDates,//del
    changeAvailability,
    upload_thumbnail,
    upload_images,
    addImages,
    getImages,
    getImageByPath,
    deleteImage , 
    upload_profile  
}