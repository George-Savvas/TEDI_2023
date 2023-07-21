const userController = require('../Controllers/UserController.js')
const router = require('express').Router()

router.post('/addUser', userController.addUser)
router.get('/getAllUsers',userController.getAllUsers)
router.get('/getUser/:id',userController.getUserById)
router.get('/getUserByUsername/:username',userController.getUserByUsername)
router.post('/login',userController.login)
router.post('/usernameExists',userController.usernameExists)
router.post('/emailExists',userController.emailExists)
router.put('/update/:id',userController.updateUser)
router.put('/activate/:id',userController.activateUser)
router.delete('/delete/:id',userController.deleteUser)

module.exports = router
