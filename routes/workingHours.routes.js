const express = require('express')
const workingHoursController = require('../controller/workingHours.controller')
const router = new express.Router()
const authAdmin = require("../middleware/authAdmin");
const authP = require("../middleware/authPatient");

router.post('/addWorkingHours', authAdmin, workingHoursController.addWorkingHours)
router.get('/getWorkingHours', authAdmin, workingHoursController.getWorkingHours)
router.get('/getWorkingHoursByDate/:day', authAdmin, workingHoursController.getWorkingHoursByDate)
router.delete('/deleteWorkingHours/:id', authAdmin, workingHoursController.deleteWorkingHoursById)


module.exports = router