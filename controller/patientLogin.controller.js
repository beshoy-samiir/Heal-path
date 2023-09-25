const patientModel = require('../models/patientModel')
const workingHours = require('../models/workingHoursModel')
const duration = require('../models/durationModel')
const appointment = require('../models/appointmentModel')


class PatientLogin {

    static login = async (req, res) => {
        try {
            const patient = await patientModel.login(req.body.PatientName, req.body.PhoneNumber)
            const token = await patient.generateToken()
            res.status(200).send({
                apiStatues: true,
                data: { token, patient },
                message: "patient loggedin",
            })
        } catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "cannot logins ",
            });
        }
    };
    static getAll = async (req, res) => {
        try {
            const patients = await patientModel.find()
            res.send({
                apiStatues: true,
                data: patients,
                message: "data featched successfully"
            })
        }
        catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "error fetching user"
            })
        }
    }

    static addAppointment = async (req, res) => {
        try {
            const [dateStrings, timeStrings] = req.body.time.split(' ');
            const [days, months, years] = dateStrings.split('/');
            // const reversedDateStrings = `${months}/${days}/${years}`;
            let newDate = dateStrings
            let newTime = timeStrings
            console.log(newDate);
            const getAppointment = await appointment.findOne({ date: newDate, time: newTime, doctorId: req.body.doctorId })
            console.log(getAppointment);
            if (getAppointment) {
                throw Error('This Appointment Is Not Available')
            } else {

                let newAppointment;
                newAppointment = await new appointment({ doctorId: req.body.doctorId, patientId: req.patient._id, time: req.body.time })
                newAppointment.date = newDate
                newAppointment.time = newTime
                newAppointment.isAvaliable = false;
                await newAppointment.save();
                newAppointment = await newAppointment.populate({
                    path: "patientId",
                    strictPopulate: false,

                });
                res.status(200).send({
                    apiStatues: true,
                    newAppointment,
                    message: "New Appointment Added"
                })
            }
        } catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "can not Added New Appointment",
            })
        }
    }

    static getWorkingHours = async (req, res) => {
        try {
            const data = await workingHours.findOne({ doctorId: req.params.doctorId })
            res.status(200).send({
                apiStatues: true,
                data,
                message: "All Working Hours"
            })
        } catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "can't Working Hours",
            });
        }

    }

    static getDuration = async (req, res) => {
        try {
            const getDuration = await duration.findOne({ doctorId: req.params.doctorId })
            res.status(200).send({
                apiStatues: true,
                getDuration,
                message: "All Durations"
            })
        } catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "can't get Duration",
            });
        }
    }
}



module.exports = PatientLogin








