const db = require('../Models')

const User = db.users

const addUser = async (req,res) => {

    let Info = {
        id: req.body.id,
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        telephone: req.body.telephone,
        role: req.body.role
    }

    const user = await User.create(Info)
    res.status(200).json({user: user})
    console.log(user)
}

module.exports = {
    addUser
}