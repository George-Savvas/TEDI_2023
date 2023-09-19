const db = require('../Models')
const {Sequelize, DataTypes} = require('sequelize')
const Op = Sequelize.Op;

const Booking = db.bookings
const Room = db.rooms
const User = db.users
const Availability = db.availabilities

const addBooking = async (req,res) => {   

//1) MAKE THESE DATES FROM NOW ON UNAVAILABLE
    await Availability.update( // returns count because it is update
        {   
            available:false
        },
        {where: {
            roomId: req.body.roomId ,   // sequelize assumes we want op.AND when not specified
            date: {
                [Op.lt]: req.body.OutDate,  // we leave OutDate available for a "check-in" date
                [Op.gte]: req.body.InDate
              }
            }
        })

// 2) CREATE THE BOOKING
        let BookingInfo = {
            InDate: req.body.InDate,
            OutDate : req.body.OutDate,
            roomId : req.body.roomId,
            userId: req.body.userId
        }

    const booking = await Booking.create(BookingInfo)
    res.status(200).json({booking: booking})
    //console.log(booking)
}

// !!!! IMPORTANT : for every addBooking request a changeAvailability(RoomController) request  
//                  should be made for the same dates(to update the callendar)

/*
const getBooking = async(req,res) => {    
    let RoomId=req.body.roomId
    let InDate=req.body.InDate
...
    res.status(200).json({booking: booking})
}
/* */
const getAllBookings = async (req,res) => {
    let bookings = await Booking.findAll()
    res.status(200).json({bookings: bookings})
}

const getUserBookings = async(req,res) => {    
    const bookings = await Booking.findAll(
        {include: { model: User
            ,
        where: {
            id: req.params.userId
          }/* */}
    })
    
    res.status(200).json({bookings:bookings})
}

const getRoomBookings = async(req,res) => {    
 
    const bookings = await Booking.findAll(
        {include: { model: Room,
        where: {
            id: req.params.roomId
          }/**/}
    })
    res.status(200).json({bookings:bookings})
}

/*
const getBookingById = async(req,res) => {    
    let Id=req.params.id
    ...
}
/* */

// updateBooking:Doesn't exist probably if user wants to update dates 
// then it's better to delete old booking and for a new to be created  


const deleteBookingById = async(req,res) => {
    let Id=req.params.id
    await Booking.destroy({
        where: {
          id: Id
        }
      })
      res.status(200).json({message: "Booking deleted succesfully!"})  
    
    // make room available
}

// !!!! IMPORTANT : for every deleteBookingById request a changeAvailability(RoomController) request  
//                  should be made for the same dates(to update the callendar)

/* ALTERNATIVE
const deleteBooking = async(req,res) => {
    let RoomId=req.body.roomId
    let InDate=req.body.InDate
...
      res.status(200).json({message: "Room deleted succesfully!"})  
}
/* */
module.exports = {
    addBooking,
    getAllBookings,
    getUserBookings,
    getRoomBookings,
    deleteBookingById,
}
