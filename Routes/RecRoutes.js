const searchAndVisitController = require('../Controllers/SearchAndVisitConstroller')
const router = require('express').Router()
const recController = require('../Controllers/RecController.js')


router.post('/addSearchHistory/:userId', searchAndVisitController.addSearchHistory)
router.get('/getSearchHistory/:userId',searchAndVisitController.getSearchHistory)
router.post('/addVisit', searchAndVisitController.addVisit)

router.get('/getRecommendations/:userId',recController.getRecommendations) 

//router.get('/createRecommendations/:userId',recController.createRecommendations) 


module.exports = router