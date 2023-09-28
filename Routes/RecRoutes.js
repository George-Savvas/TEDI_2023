const searchAndVisitController = require('../Controllers/SearchAndVisitConstroller')
const router = require('express').Router()

router.post('/addSearchHistory/:userId', searchAndVisitController.addSearchHistory)
router.get('/getSearchHistory/:userId',searchAndVisitController.getSearchHistory)
router.post('/addVisit', searchAndVisitController.addVisit)

module.exports = router