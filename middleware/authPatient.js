const jwt = require("jsonwebtoken");
const patientLogin = require("../models/patientModel");
const userModel = require("../models/userModel");

const authPatient = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const d_token = jwt.verify(token, process.env.JWTKEY);
        const patient = await patientLogin.findOne({
            _id: d_token,
            "tokens.token": token,
        });
        const user = await userModel.findOne({
            _id: d_token,
            "tokens.token": token,
        });
        if (!user && !patient) {
            throw new Error("invalid user")
        };
        if (patient) {
            req.patient = patient;
        };
        if (user) {
            req.user = user;
        };
        req.token = token;
        next();
    } catch (e) {
        res.status(500).send({
            apiStatus: false,
            data: e.message,
            message: "not authorizedddddddd",
        });
    }
};
module.exports = authPatient;