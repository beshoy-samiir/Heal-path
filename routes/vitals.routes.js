const express = require('express')
const vitalsController = require('../controller/vitals.controller')
const router = new express.Router()
const authAdmin = require("../middleware/authAdmin");
const authP = require("../middleware/authPatient");

router.post('/addVitals/:appointmentId/:patientId', authAdmin, vitalsController.addVitals)
router.get('/getVitals/:appointmentId/:patientId', authP, vitalsController.getVitals)
router.delete('/deleteVital/:id', authAdmin, vitalsController.deleteVitalById)

module.exports = router