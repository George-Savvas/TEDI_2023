const db = require('../Models')
const {Sequelize, DataTypes} = require('sequelize')
const Room = db.rooms
const Availability = db.availabilities

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
        userId: req.body.userId
    }

    const room = await Room.create(roomInfo)
    res.status(200).json({room: room})
    console.log(room)
}

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

    const availabilities = await Availability.findAll(
        {include: { model: Room, as: 'room' ,
        where: {
            id: req.body.roomId
          }}
    })

    res.status(200).json({availabilities: availabilities})
    console.log(availabilities)
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

const getAvailableRooms= async(req,res)=>{
    let location=req.params.location
    let start_date=req.params.start_date
    let end_date=req.params.end_date

    wanted_dates=[]

    //rooms = await Room.findAll({where: location=location})
    availabilities = await Availability.findAll(
            {where:{
            [Op.notIn]: wanted_dates
            }
            })
    res.status(200).json({rooms: rooms})

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
    await Room.destroy({
        where: {
          id: Id
        }
      })
      res.status(200).json({message: "Room deleted succesfully!"})  
}

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
    deleteDates
}