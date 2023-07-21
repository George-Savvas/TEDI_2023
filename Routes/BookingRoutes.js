const bookingController = require('../Controllers/BookingController.js')
const router = require('express').Router()

router.post('/addBooking', bookingController.addBooking)
router.get('/getAllBookings',bookingController.getAllBookings)
router.get('/getUserBookings/:userId',bookingController.getUserBookings)
router.get('/getRoomBookings/:roomId',bookingController.getRoomBookings)
router.delete('/deleteBookingById/:id',bookingController.deleteBookingById)

module.exports = router
