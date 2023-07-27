const fs = require('fs');
var xml = require('xml');
var xml2js = require('xml2js');
const db = require('../Models')
//sconst https = require('https');

const Booking = db.bookings
const Room = db.rooms
const User = db.users
const Availability = db.availabilities


const downloadJSON = async (req,res) => {   // the json body is set at the front-end
  let users=await User.findAll()
  let json = JSON.stringify(users,null,4)

//  DEL:
  // fs.writeFile("adminFiles/JSON_File.js",json,(err) => {
  //    if (err) throw err;
  //  });

  // res.download('adminFiles/JSON_File.js', function (error) {
  //    console.log("Error : ", error)
  // });
  //res.status(200).json({message:"done!"})

  res.status(200).json({users: users})
}

const jsonToXML = async (req,res) => {   // the json body is set at the front-end
    let jsonObj = req.body
//    console.log("json: ",req.body)
    var builder = new xml2js.Builder();
    var xml_obj = builder.buildObject(jsonObj);  
//    console.log("xml_obj: ",xml_obj)
    // res.status(200).send(xml_obj)
    res.set('Content-Type', 'text/xml');
    //res.status(200).send(xml(xml_obj))
    res.status(200).send(xml_obj)
  }


  // DEL :
const downloadXML = async (req,res) => {   // the json body is set at the front-end
  let jsonObj = req.body
  
  var builder = new xml2js.Builder();
  var xml = builder.buildObject(jsonObj);  

  res.status(200).json({message:"done!"})
}

// delete files

module.exports = {
  downloadJSON,
  downloadXML,
  jsonToXML
}