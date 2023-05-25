const db = require('../Models')
const bcrypt = require("bcrypt")

const User = db.users

const addUser = async (req,res) => {
    let password = req.body.password
    bcrypt.hash(password,10).then((hash_password)=>{  // bcrypt.hash will encrypt the password
        User.create({
            //id: req.body.id,
            username: req.body.username,
            password: hash_password,
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            telephone: req.body.telephone,
            isTenant: req.body.isTenant,
            isLandlord: req.body.isLandlord,
            isAdmin: req.body.isAdmin
            })
        res.status(200).json("Succesful addition!")
        })
    }
    
const getAllUsers = async(req,res)=>{
    let users=await User.findAll()
    res.status(200).json({users:users})
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

const usernameExists =async(req,res)=>{
    let username= req.body.username;
    // if not exist : error
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
    await User.update(
        {   
            username: req.body.username,
            //password: hash_password, // bale allo update me confirm initial password
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            telephone: req.body.telephone,
            isTenant: req.body.isTenant,
            isLandlord: req.body.isLandlord,
            isAdmin: req.body.isAdmin        },
        {where: {id: Id}}
        )
    res.status(200).json({message: "Information updated succesfully!"})
}

const deleteUser = async(req,res) => {
    let Id=req.params.id
    await User.destroy({
        where: {
          id: Id
        }
      })
      res.status(200).json({message: "User deleted succesfully!"})  
}

module.exports = {
    addUser,getAllUsers,login, usernameExists ,emailExists,updateUser,deleteUser
}