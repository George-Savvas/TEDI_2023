const userController = require('../Controllers/UserController.js')
const router = require('express').Router()

router.post('/addUser', userController.addUser)
router.get('/getAllUsers',userController.getAllUsers)
router.post('/login',userController.login)

module.exports = router
