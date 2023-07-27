const fileController = require('../Controllers/FileController.js')
const router = require('express').Router()

router.get('/downloadJSON',fileController.downloadJSON)
router.get('/downloadXML',fileController.downloadXML)
router.post('/jsonToXML',fileController.jsonToXML)


module.exports = router
