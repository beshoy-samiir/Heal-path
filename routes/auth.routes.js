const router = require("express").Router()
const auth = require("../controller/auth.controller")
require("../models/dbCon")
const authAdmin = require("../middleware/authAdmin");
const authP = require("../middleware/authPatient");

router.post("/login", auth.login)
router.get("/allDoctors", authP, auth.getAll)
router.get("/Doctor/:id", authP, auth.getSingle)
router.delete('/deleteUser/:id', authAdmin, auth.deleteUser)


module.exports = router
