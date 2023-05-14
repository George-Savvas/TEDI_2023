const userController = require('../Controllers/UserController.js')
const router = require('express').Router()

router.post('/addUser', userController.addUser)
router.get('/getAllUsers',userController.getAllUsers)
router.post('/login',userController.login)
router.get('/usernameExists',userController.usernameExists)
router.get('/emailExists',userController.emailExists)
router.put('/update/:id',userController.updateUser)
router.delete('/delete/:id',userController.deleteUser)

module.exports = router
