const express = require("express")
const cors = require('cors');

const app = express()

require("dotenv").config()
app.use(express.json())
app.use(cors())
require("../models/dbCon")
const routes = require("../routes/auth.routes")
const patientRouter = require('../routes/patient.routes')
const durationRouter = require("../routes/duration.routes")
const dayOff = require("../routes/dayOff.routes")
const workingHours = require("../routes/workingHours.routes")
const appointment = require("../routes/appointment.routes")
const vitals = require("../routes/vitals.routes")
const emr = require("../routes/emr.routes")
const patientLogin = require("../routes/patientLogin.routes")
app.use(routes)
app.use(patientRouter)
app.use(durationRouter)
app.use(dayOff)
app.use(workingHours)
app.use(appointment)
app.use(vitals)
app.use(emr)
app.use(patientLogin)
app.get("*", (req, res) => res.send({ error: "invalid url" }))

module.exports = app