const roomController = require('../Controllers/RoomController.js')
const reviewController = require('../Controllers/ReviewController.js')
const recController = require('../Controllers/RecController.js')

const router = require('express').Router()

router.post('/addRoom',roomController.upload_thumbnail,roomController.addRoom )

router.post('/addImages/:roomId',roomController.upload_images,roomController.addImages)

router.get('/getImages/:roomId', roomController.getImages)

router.get('/getImageByPath', roomController.getImageByPath)

router.delete('/deleteImage/:id',roomController.deleteImage)

//router.post('/addAvailability', roomController.addAvailability)

router.post('/set_Availabilities/:roomId',roomController.set_Availabilities)

router.get('/getAllRooms', roomController.getAllRooms)

router.get('/viewRoom/:id', roomController.getRoomById)

router.get('/getUserRooms/:userId', roomController.getUserRooms)

router.post('/getAvailableRoomsByFilters', roomController.getAvailableRoomsByFilters)

router.put('/update/:id', roomController.upload_thumbnail,roomController.updateRoom)

router.put('/noThumbnail/:id', roomController.noThumbnail)

router.delete('/delete/:id',roomController.deleteRoom)

router.put('/changeAvailability', roomController.changeAvailability)

router.get('/getAvailableDates/:roomId',roomController.getAvailableDates)

router.get('/getRecommendations/:userId',recController.getRecommendations) // id->userid

router.delete('/deleteDates/:roomId',roomController.deleteDates)

router.post('/addReview',reviewController.addReview)

module.exports = router
