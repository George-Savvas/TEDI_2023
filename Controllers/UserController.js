const db = require('../Models')
const bcrypt = require("bcrypt")

const User = db.users

const addUser = async (req,res) => {
    let password = req.body.password
    bcrypt.hash(password,10).then((hash_password)=>{  // bcrypt.hash will encrypt the password
        User.create({
            id: req.body.id,
            username: req.body.username,
            password: hash_password,
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            telephone: req.body.telephone,
            role: req.body.role
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
        res.status(200).json({error:"Username doesn't exist"});
    } 

    else { 
        bcrypt.compare(password,user.password).then((equal)=>{
            if(!equal){
                res.status(200).json({error:"Wrong username and password combination"})
                //res.status(200).json({hashed:hash_password})
            }
            else 
                res.status(200).json({message:"succesful login!"})
        })
    }
}

module.exports = {
    addUser,getAllUsers,login
}