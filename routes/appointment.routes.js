const express = require('express')
const appointmentController = require('../controller/appointment')
const router = new express.Router()
const authAdmin = require("../middleware/authAdmin");
const authP = require("../middleware/authPatient");



router.post('/addAppointment', authAdmin, appointmentController.addAppointment)
router.get('/getAllAppointmentForDoctor', authAdmin, appointmentController.getAllAppointments)
router.get('/getAllAppointmentForDoctor/:doctorId/:patientId', authP, appointmentController.getAllAppointmentsForDoctor)
router.get('/getAllAppointmentForPatient/:patientId', authP, appointmentController.getAllAppointmentsForPatient)
router.delete('/deleteAppointment/:id', authAdmin, appointmentController.deleteAppointmentById)
router.post("/editAppointment/:id", authAdmin, appointmentController.editAppointment)

module.exports = router