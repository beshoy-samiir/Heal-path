const express = require('express')
const DayOffController = require('../controller/dayOff.controller')
const router = new express.Router()
const authAdmin = require("../middleware/authAdmin");

router.post('/addDayOff', authAdmin, DayOffController.addDayOff)
router.get('/getDayOff', authAdmin, DayOffController.getDayOff)
router.delete('/deleteDayOff/:id', authAdmin, DayOffController.deleteDayOffById)

module.exports = router