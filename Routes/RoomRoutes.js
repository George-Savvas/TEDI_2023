const roomController = require('../Controllers/RoomController.js')
const router = require('express').Router()

router.post('/addRoom',roomController.upload_thumbnail,roomController.addRoom )

router.post('/addAvailability', roomController.addAvailability)

router.post('/set_1_year_Availability',roomController.set_1_year_Availability)

router.get('/getAllRooms', roomController.getAllRooms)

router.get('/viewRoom/:id', roomController.getRoomById)

router.get('/getAvailableRooms', roomController.getAvailableRooms)

router.put('/update/:id', roomController.updateRoom)

router.delete('/delete/:id',roomController.deleteRoom)

router.put('/changeAvailability', roomController.changeAvailability)

router.delete('/deleteDates',roomController.deleteDates)

module.exports = router
