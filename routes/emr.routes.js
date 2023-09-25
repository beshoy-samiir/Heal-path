const express = require('express')
const emrController = require('../controller/emr.controller')
const router = new express.Router()
const upload = require("../middleware/emrUpload")
const authAdmin = require("../middleware/authAdmin");
const authP = require("../middleware/authPatient");


router.post('/addEmr/:appointmentId', upload.single("upload"), emrController.addEmr)
router.get('/getEmr/:appointmentId',authP, emrController.getEmr)
router.delete('/deleteEmr/:id',authAdmin, emrController.deleteEmrById)

module.exports = router