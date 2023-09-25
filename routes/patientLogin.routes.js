const router = require("express").Router()

const auth = require("../controller/patientLogin.controller")
const authP = require("../middleware/authPatient");

router.post("/loginPatient", auth.login)
router.post('/addAppointmentForPatient', authP, auth.addAppointment)
router.get('/getWorkingHours/:doctorId', authP, auth.getWorkingHours)
router.get('/getDuration/:doctorId', authP, auth.getDuration)




module.exports = router
