const userController = require('../Controllers/UserController.js')
const roomController = require('../Controllers/RoomController.js')
const router = require('express').Router()

router.post('/addUser', roomController.upload_profile ,userController.addUser)
router.get('/getAllUsers',userController.getAllUsers)
router.get('/getUser/:id',userController.getUserById)
router.get('/getUserByUsername/:username',userController.getUserByUsername)
router.post('/login',userController.login)
router.post('/usernameExists',userController.usernameExists)
router.post('/emailExists',userController.emailExists)
router.put('/update/:id',roomController.upload_profile,userController.updateUser)
router.put('/activate/:id',userController.activateUser)
router.delete('/delete/:id',userController.deleteUser)

module.exports = router
