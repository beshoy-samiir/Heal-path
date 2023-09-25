const appointment = require('../models/appointmentModel')
const doctor = require('../models/userModel')
const patient = require('../models/patientModel')

class Appointment {
    static addAppointment = async (req, res) => {
        try {
            let newAppointment;

            console.log(req.user._id);
            const getDoctor = await doctor.findById(req.user._id);

            if (getDoctor) {
                newAppointment = await new appointment({ doctorId: req.user._id, patientId: req.body.patientId, date: req.body.date, time: req.body.time })
                const [dateString, timeString] = newAppointment.time.split(' ');
                const [day, month, year] = dateString.split('/');
                const reversedDateString = `${month}/${day}/${year}`;
                newAppointment.date = reversedDateString
                newAppointment.time = timeString
                await newAppointment.save();
                newAppointment = await newAppointment.populate({
                    path: "patientId",
                    strictPopulate: false,

                });
            } else {
                throw Error()
            }
            res.status(200).send({
                apiStatues: true,
                newAppointment,
                message: "New Appointment Added"
            })
        } catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "can not Added New Appointment",
            })
        }
    }

    static getAllAppointments = async (req, res) => {
        try {
            const getAppointment = await appointment.find({ doctorId: req.user._id }).populate({
                path: "patientId",
                strictPopulate: false,

            });
            res.status(200).send({
                apiStatues: true,
                getAppointment,
                message: "All Appointments For Doctor"
            })
        } catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "can't find All Appointments For Doctor"
            });
        }
    }
    static getAllAppointmentsForDoctor = async (req, res) => {
        try {
            console.log(req.params.patientId);
            console.log(req.params.doctorId);
            const getAppointment = await appointment.find({ doctorId: req.params.doctorId, patientId: req.params.patientId })
            res.status(200).send({
                apiStatues: true,
                getAppointment,
                message: "All Appointments For Patient"
            })
        } catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "can't find Appointments For Patient"
            });
        }
    }

    static getAllAppointmentsForPatient = async (req, res) => {
        try {
            console.log(req.params.patientId);
            const getAppointment = await appointment.find({ patientId: req.params.patientId })
            res.status(200).send({
                apiStatues: true,
                getAppointment,
                message: "All Appointments For Patient"
            })
        } catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "can't find Appointments For Patient"
            });
        }
    }

    static deleteAppointmentById = async (req, res) => {
        try {
            console.log(req.params.id);
            const deleteAppointment = await appointment.findByIdAndDelete(req.params.id)
            console.log(deleteAppointment);
            res.status(200).send({
                apiStatues: true,
                deleteAppointment,
                message: "Delete Appointment"
            })
        } catch (e) {
            res.status(404).send({
                apiStatues: false,
                data: e.message,
                message: "can't delete Appointment",
            });
        }
    }

    static editAppointment = async (req, res) => {
        try {
            console.log('req.params._id');
            console.log(req.params.id);
            const editAppointment = await appointment.findById(req.params.id)
            console.log(editAppointment)
            if (editAppointment) {
                let date = req.body.date;
                let timer = req.body.time
                console.log(timer.length);
                if (timer.length == 4) {
                    timer = timer + '0'
                }
                const parts = date.split("/");
                const formattedDate = `${parts[1]}/${parts[0]}/${parts[2]}`;
                editAppointment.date = formattedDate
                editAppointment.time = timer

                await editAppointment.save()
            }
            else {
                throw new Error("error")
            }
            res.status(200).send({
                apiStatues: true,
                editAppointment,
                message: "edit Appointment"
            })
        }
        catch (e) {
            res.status(404).send({
                apiStatues: false,
                data: e.message,
                message: "can't edit Appointment",
            });
        }
    }

}
module.exports = Appointment
