const db = require('../Models')


async function set_avail_dates_func(InDate,OutDate,RoomId){

      let maxDate = new Date(OutDate)
      console.log(OutDate,maxDate)
      let currDate = new Date(InDate)
      do {
    
        let Date = currDate.toJSON().slice(0,10)  // we give it the form of a DATE datatype (by keeping the first 10 characters)
        
        await db.availabilities.create({
            date: Date,
            available:true,
            roomId:RoomId}) 

        currDate.setDate(currDate.getDate() + 1) // next day
      } while(currDate <= maxDate)

}

module.exports = { set_avail_dates_func };