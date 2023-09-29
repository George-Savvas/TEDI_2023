const https = require('https');
const fs = require('fs');

const express = require('express')
const app = express()
const cors = require('cors')
const port = 7000//process.env.PORT || 7000

app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

const roomRouter = require('./Routes/RoomRoutes.js')
app.use('/rooms', roomRouter)

const userRouter = require('./Routes/UserRoutes.js')
app.use('/auth', userRouter)

const bookingRouter = require('./Routes/BookingRoutes.js')
app.use('/bookings', bookingRouter)

const recRouter = require('./Routes/RecRoutes.js')
app.use('/recommendations', recRouter)

const fileRouter = require('./Routes/FileRoutes.js')
app.use('/files', fileRouter)

app.use('/images',express.static('./images'))

app.get('/', (req,res) => {
    res.status(200).json({message: "Home Page"})
})

app.all('*', (req,res) => {
    res.status(404).json({message: "Page not found"})
})

const options= {
    key:fs.readFileSync('ryans-key.pem'),
    cert:fs.readFileSync('ryans-cert.pem')
}

// https.createServer(options,app,(req,res)=>{
//     res.end(`Server listening on port ${port}...`)
// }).listen(port)

// no tls sll:
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`)
}) 