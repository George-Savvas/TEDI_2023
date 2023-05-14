const db = require('../Models')

const Room = db.rooms

const addRoom = async (req,res) => {

    let roomInfo = {
        //id: req.body.id,
        name: req.body.name,
        price: req.body.price,
        dates_available: req.body.dates_available,
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
            dates_available: req.body.dates_available,
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

module.exports = {
    addRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom
}