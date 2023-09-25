const express = require('express')
const router = new express.Router()
const durationController = require('../controller/duration.controller')
const authAdmin = require("../middleware/authAdmin");
const authP = require("../middleware/authPatient");

router.post('/addDuration', authAdmin, durationController.addDuration)

router.get('/getDuration', authP, durationController.getDuration)

router.delete('/deleteDuration/:id', authAdmin, durationController.deleteDurationById)

module.exports = router