const roomController = require('../Controllers/RoomController.js')
const router = require('express').Router()

router.post('/addRoom', roomController.addRoom)
router.get('/getAllRooms', roomController.getAllRooms)

module.exports = router
