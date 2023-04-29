const roomController = require('../Controllers/RoomController.js')
const router = require('express').Router()

router.post('/addRoom', roomController.addRoom)

router.get('/getAllRooms', roomController.getAllRooms)

router.get('/viewRoom/:id', roomController.getRoomById)

router.put('/update/:id', roomController.updateRoom)

router.delete('/delete/:id',roomController.deleteRoom)

module.exports = router
