const fs = require('fs');
var xml2js = require('xml2js');

//sconst https = require('https');


const downloadJSON = async (req,res) => {   // the json body is set at the front-end
  let json = JSON.stringify(req.body,null,4)
  //fs.writeFile("adminFiles/JSON_File.js",json,(err) => {
  console.log(json)
  console.log("json",req.body)
  fs.writeFile("adminFiles/JSON_File.js",json,(err) => {
    if (err) throw err;
  });

  res.status(200).json({message:"done!"})
}

const downloadXML = async (req,res) => {   // the json body is set at the front-end
  let jsonObj = req.body
  console.log("json",req.body)
  var builder = new xml2js.Builder();
  var xml = builder.buildObject(jsonObj);  

  console.log(xml)
  fs.writeFile("adminFiles/XML_File.xml",xml,(err) => {
    if (err) throw err;
  });
  res.status(200).json({message:"done!"})
}

// delete files

module.exports = {
  downloadJSON,
  downloadXML
}