const db = require('../Models')
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
        price: req.body.price,
        location: req.body.location,
        area: req.body.area,
        floor: req.body.floor,
        heating: req.body.heating,
        description: req.body.description,
        userId: req.body.userId,
        openStreetMapX:req.body.openStreetMapX,
        openStreetMapY: req.body.openStreetMapY,
        openStreetMapLabel: req.body.openStreetMapLabel,

        country:req.body.country,
        address: req.body.address,
        accessibilityToMeansOfTransport: req.body.accessibilityToMeansOfTransport,
        maxNumOfPeople: req.body.maxNumOfPeople,
        cost: req.body.cost,
        additionalCostPerPerson: req.body.additionalCostPerPerson,
        roomType: req.body.roomType,
        rules: req.body.rules,
        numOfBeds: req.body.numOfBeds,
        numOfBathrooms: req.body.numOfBathrooms,
        numOfBedrooms: req.body.numOfBedrooms ,
        livingRoomInfo: req.body.livingRoomInfo,
        roomArea: req.body.roomArea
    }

    if(req.file) // if thumbnail is to be updated
    {
        // add new thumbnail path to RoomInfo 
        RoomInfo["thumbnail_img"] = req.file.path
    }
    else 
        console.log("no file")

    try {
      const room = await Room.create(RoomInfo)
      res.status(200).json({room: room})
      console.log(room)
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
        price: req.body.price,
        location: req.body.location,
        area: req.body.area,
        floor: req.body.floor,
        heating: req.body.heating,
        description: req.body.description,        
        userId: req.body.userId,
        openStreetMapX:req.body.openStreetMapX,
        openStreetMapY: req.body.openStreetMapY,
        openStreetMapLabel: req.body.openStreetMapLabel,
        country:req.body.country,
        address: req.body.address,
        accessibilityToMeansOfTransport: req.body.accessibilityToMeansOfTransport,
        maxNumOfPeople: req.body.maxNumOfPeople,
        cost: req.body.cost,
        additionalCostPerPerson: req.body.additionalCostPerPerson,
        roomType: req.body.roomType,
        rules: req.body.rules,
        numOfBeds: req.body.numOfBeds,
        numOfBathrooms: req.body.numOfBathrooms,
        numOfBedrooms: req.body.numOfBedrooms ,
        livingRoomInfo: req.body.livingRoomInfo,
        roomArea: req.body.roomArea
    }

    if(req.file) // if thumbnail is to be updated
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


const deleteRoom = async(req,res) => {
    let Id=req.params.id

    // DELETE IMAGES FROM './images' CLEAR SPACE 
    //1) DELETE thumbnail_img
    const room=await Room.findByPk(Id,{
        attributes: ['thumbnail_img']
        })
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



//////////  AVAILABILITIES:

const addAvailability = async (req,res) => {
    let Info={
        date: req.body.date,
        available:true,
        price: req.body.price,
        roomId:req.body.roomId        
    }

    const availability=await Availability.create(Info)
    res.status(200).json({availability:availability})
    console.log(availability)
}

const set_1_year_Availability = async (req,res) => {

    const currDate = new Date()
    
    for(let i=0;i<365;i++){
    
        let Date = currDate.toJSON().slice(0,10)  // we give it the form of a DATE datatype (by keeping the first 10 characters)
       
         await db.availabilities.create({
            date: Date,
            available:true,
            price: req.body.price,
            roomId:req.body.roomId}) 

        currDate.setDate(currDate.getDate() + 1) // next day
    }   

    const availabilities = await Availability.findAll( // maybe del
        {include: { model: Room,
        where: {
            id: req.body.roomId
          }}
    })

    res.status(200).json({availabilities: availabilities})
    //console.log(availabilities)
}

const getAvailableRooms= async(req,res)=>{
    let location=req.body.location
    let InDate=new Date(req.body.InDate)
    let OutDate=new Date(req.body.OutDate)

    //rooms = await Room.findAll({where: location=location})
    const unavailable_rooms = await Room.findAll(
        {

        attributes: ['id'],
        
        where:{location:location},
            
        include: { 
                model: Availability,
                where:{
                    //roomId:{$col: 'Room.id'}, AVOID,happens automatically

                    date:{
                        [Op.lt]: OutDate,  // we leave OutDate available for a "check-in" date
                        [Op.gte]: InDate
                        },
                    
                    available:false
                }
            }
                
        });
    
    const unavailable_Ids = unavailable_rooms.map((un_room) => un_room.id);
    
    const available_rooms = await Room.findAll(
        {
            where :
            { 
            location:location,
            id:{[Op.notIn]:unavailable_Ids}
            }
        }
    );
/* */

    res.status(200).json({rooms: available_rooms})//available_rooms})
    }


const changeAvailability = async(req,res) => {
    let RoomId =req.body.roomId
    let InDate = new Date(req.body.InDate)
    let OutDate = new Date(req.body.OutDate)
    let Available = req.body.available

    const availabilities=await Availability.update(
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
/*
const changeAvailability = async(req,res) => {
    let RoomId =req.body.roomId
    let Date = req.body.date
    let Available = req.body.available

    await Room.update(
        {   
            available:Available
        },
        {where: {roomId: RoomId , date:Date}})
    }
/* */

    
//////// maybe delete: /////////////////
const deleteDates= async(req,res) => {
    //let datekey=req.params.datekey
    await Availability.destroy({
        where: {
            //datekey:datekey 
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
    getAvailableRooms,
    updateRoom,
    deleteRoom,
    set_1_year_Availability,
    addAvailability,
    deleteDates,
    changeAvailability,
    upload_thumbnail,
    upload_images,
    addImages,
    getImages,
    getImageByPath,
    deleteImage , 
    upload_profile
}