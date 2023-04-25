const db = require('../Models')

const Room = db.rooms

const addRoom = async (req,res) => {

    let roomInfo = {
        id: req.body.id,
        name: req.body.name,
        price: req.body.price,
        dates_available: req.body.dates_available,
        location: req.body.location,
        area: req.body.area,
        floor: req.body.floor,
        heating: req.body.heating,
        description: req.body.description
    }

    const room = await Room.create(roomInfo)
    res.status(200).json({message: room})
    console.log(room)
}

const getAllRooms = async (req,res) => {
    let rooms = await Room.findAll()
    res.status(200).json({message: rooms})
}

module.exports = {
    addRoom,
    getAllRooms
}

/* Bale pantou res.status(200).json({message: rooms}) */
