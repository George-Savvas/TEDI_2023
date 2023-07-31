const db = require('../Models')
const {Sequelize, DataTypes} = require('sequelize')
const Op = Sequelize.Op;
const Room = db.rooms
const Availability = db.availabilities
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

const upload_images= upload.array('images');

const addRoom = async (req,res) => {

    let roomInfo = {
        //id: req.body.id,
        name: req.body.name,
        price: req.body.price,
        location: req.body.location,
        area: req.body.area,
        floor: req.body.floor,
        heating: req.body.heating,
        description: req.body.description,
        thumbnail_img: req.file.path,
        //images: req.files.path,
        userId: req.body.userId
    }
    
    // var paths = req.files.map(file => file.path)
    // console.log("paths",paths)

    try {
      const room = await Room.create(roomInfo)
      res.status(200).json({room: room})
      console.log(room)
    }catch(error) {
       res.status(400).send(error);
    }
}



const getAllRooms = async (req,res) => {
    let rooms = await Room.findAll()
    res.status(200).json({rooms: rooms})
}

const getRoomById = async(req,res) => {    
    let Id=req.params.id
    let room=await Room.findByPk(Id)
    res.status(200).json({room: room})
}

const updateRoom = async(req,res) => {
    let Id=req.params.id
    await Room.update(
        {   
            //id: req.body.id,
            name: req.body.name,
            price: req.body.price,
            location: req.body.location,
            area: req.body.area,
            floor: req.body.floor,
            heating: req.body.heating,
            description: req.body.description,
            userId: req.body.userId
        },
        {where: {id: Id}}
        )
    res.status(200).json({message: "Information updated succesfully!"})
}

const deleteRoom = async(req,res) => {
    let Id=req.params.id

    // DELETE img from 'images' to clear space
    const room=await Room.findByPk(Id,{
        attributes: ['thumbnail_img']
        })
    const img_path=room.thumbnail_img    //const img_path = room.map((room) => room.thumbnail_img);
    if(img_path ){  // if thumbnail_img != NULL 
      fs.unlink(img_path, function(err) {
        if (err) {
            console.error("Error occurred while trying to remove file");
        } 
      });
    }///////////////////////////////////    

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
    getAvailableRooms,
    updateRoom,
    deleteRoom,
    set_1_year_Availability,
    addAvailability,
    deleteDates,
    changeAvailability,
    upload_thumbnail,
    upload_images
}