const db = require('../Models')
const bcrypt = require("bcrypt")
const fs = require('fs');

const User = db.users

const addUser = async (req,res) => { // signup

    let password = req.body.password
    bcrypt.hash(password,10).then((hash_password)=>{  // bcrypt.hash will encrypt the password

        UserInfo={    //id: req.body.id,     // id is generated automaticaly
            username: req.body.username,
            password: hash_password,
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            telephone: req.body.telephone,
            active: false,
            isTenant: req.body.isTenant,
            isLandlord: req.body.isLandlord,
            isAdmin: false
            }

        ////   CHECK FOR IMAGE ADDITION //////////////
        if(req.file) // if profile_img is to be updated
        {
            // add new profile path to RoomInfo 
            UserInfo["profile_img"] = req.file.path
        }
        ///////////////////////////////////////

        User.create(UserInfo)
        res.status(200).json("Succesful addition!")
        })
    }

const login =async(req,res)=>{
    let username= req.body.username
    let password= req.body.password

    // if not exist : error
    const user= await User.findOne({ where: { username: username } });
    if (user == null) {
        res.status(200).json({message:"Username doesn't exist"});
    }

    else { 
        bcrypt.compare(password,user.password).then((equal)=>{
            if(!equal){
                res.status(200).json({message:"Wrong username and password combination"})
                //res.status(200).json({hashed:hash_password})
            }
            else 
                res.status(200).json({message:"succesful login!"})
        })
    }
}    

const getAllUsers = async(req,res)=>{
    let users=await User.findAll()
    res.status(200).json({users:users})
}
/*
const getUserById = async(req,res)=>{
    let Id=req.params.id
    const user=await User.findByPk(Id)
    res.status(200).json({user: user})
}
/* */
const getUserById = async(req,res)=>{
    let Id=req.params.id
    const user=await User.findByPk(Id,{
            attributes: { exclude: ['password'] }
            })

    res.status(200).json({user: user})
}

const getUserByUsername = async(req,res)=>{
    const user=await User.findOne({where: { username:req.params.username} 
            ,
            attributes: { exclude: ['password'] }
        })
    res.status(200).json({user: user})
}

const usernameExists =async(req,res)=>{ 
    let username= req.body.username;
    
    const user= await User.findOne({ where: { username: username } });
    if (user == null) {
        res.status(200).json({Exist:"false"});
    }
    else 
    res.status(200).json({Exist:"true"});
}

const emailExists =async(req,res)=>{
    let email= req.body.email;
    // if not exist : error
    const user= await User.findOne({ where: { email: email } });
    if (user == null) {
        res.status(200).json({Exist:"false"});
    }
    else 
    res.status(200).json({Exist:"true"});
}


const updateUser = async(req,res) => {
    let Id=req.params.id

    UserInfo={   
        username: req.body.username,
        //password: hash_password, // bale allo update me confirm initial password
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        telephone: req.body.telephone,
        //active: req.body.active, // maybe this should be false              
        isTenant: req.body.isTenant,
        isLandlord: req.body.isLandlord,
        isAdmin: req.body.isAdmin
    }

    if(req.file) // if profile_img is to be updated
    {
        // add new profile path to RoomInfo 
        UserInfo["profile_img"] = req.file.path
        
        // remove old profile from storage 

        const user =await User.findByPk(Id,{attributes:["profile_img"]}) 
        img_path = user.profile_img
        fs.unlink(img_path, function(err) { 
            if (err) {
            console.error("Error occurred while trying to remove image");
            } 
        });
    }
    await User.update(
        UserInfo,
        {where: {id: Id}}
        )
    res.status(200).json({message: "Information updated succesfully!"})
}

//////////////      ADMIN and User request 
const deleteUser = async(req,res) => {
    let Id=req.params.id
    // DELETE IMAGES FROM './images' CLEAR SPACE 
    //1) DELETE thumbnail_img
    const user=await User.findByPk(Id,{
        attributes: ['profile_img']
        })
    const img_path=user.profile_img    //const img_path = room.map((room) => room.thumbnail_img);
    if(img_path ){  // if thumbnail_img != NULL 
      fs.unlink(img_path, function(err) {
        if (err) {
            console.error("Error occurred while trying to remove image");
        } 
      });
    }
    
    await User.destroy({
        where: {
          id: Id
        }
      })
    //   if (user == null) {
    //     res.status(200).json({message:"User doesn't exist"});
    //   }
    //   else 
        res.status(200).json({message: "User deleted succesfully!"})  
}

//////////////     only ADMIN request 
const activateUser = async(req,res) => {
    let Id=req.params.id
    await User.update(
        {active:req.body.active},   // probably admin should be able to deactivate as well 
        {where: {id: Id}}
        )

    res.status(200).json({message: req.body.active})
}

module.exports = {
    addUser,login,getAllUsers,getUserById, usernameExists ,emailExists,updateUser,deleteUser , activateUser,
    getUserByUsername
}