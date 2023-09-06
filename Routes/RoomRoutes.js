const roomController = require('../Controllers/RoomController.js')
const router = require('express').Router()

router.post('/addRoom',roomController.upload_thumbnail,roomController.addRoom )

router.post('/addImages/:roomId',roomController.upload_images,roomController.addImages)

router.get('/getImages/:roomId', roomController.getImages)

router.get('/getImageByPath', roomController.getImageByPath)

router.delete('/deleteImage/:id',roomController.deleteImage)

router.post('/addAvailability', roomController.addAvailability)

router.post('/set_1_year_Availability',roomController.set_1_year_Availability)

router.get('/getAllRooms', roomController.getAllRooms)

router.get('/viewRoom/:id', roomController.getRoomById)

router.get('/getUserRooms/:id', roomController.getUserRooms)

router.get('/getAvailableRooms', roomController.getAvailableRooms)

router.get('/getAvailableRoomsByFilters', roomController.getAvailableRoomsByFilters)

router.get('/getRoomsByFilters', roomController.getRoomsByFilters)

router.put('/update/:id', roomController.upload_thumbnail,roomController.updateRoom)
router.put('/noThumbnail/:id', roomController.noThumbnail)

router.delete('/delete/:id',roomController.deleteRoom)

router.put('/changeAvailability', roomController.changeAvailability)

router.delete('/deleteDates',roomController.deleteDates)

module.exports = router
