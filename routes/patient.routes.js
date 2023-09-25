const express = require('express')
const patientController = require('../controller/patient.controller')
const router = new express.Router()
const authAdmin = require("../middleware/authAdmin");
const authP = require("../middleware/authPatient");

router.post('/addPatient', authAdmin, patientController.addPatient)
router.post('/editPatient/:id', authAdmin, patientController.editPatient)

router.get('/patients', authAdmin, patientController.getPatients)
router.post('/patients/search', authAdmin, patientController.search)

router.get('/patients/:id', authP, patientController.getPatientById)

router.delete('/deletePatient/:id', authAdmin, patientController.deletePatientById)

module.exports = router
