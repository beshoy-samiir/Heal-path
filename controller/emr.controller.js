const emr = require('../models/emrModel')
const appointment = require('../models/appointmentModel')
const fs = require("fs")
const path = require("path")

class Emr {
    static addLeadingZero(number) {
        return number < 10 ? "0" + number : number;
    }
    static addEmr = async (req, res) => {
        try {
            console.log(req.params.appointmentId);
            const getAppointment = await appointment.findOne({ _id: req.params.appointmentId })
            console.log('fffffff');
            var currentDate = new Date();
            let newEmr;

            // Get the individual components of the date
            var year = currentDate.getFullYear();
            var month = currentDate.getMonth() + 1; // Months are zero-indexed, so we add 1
            var day = currentDate.getDate();
            console.log('ssss');

            var formattedDate = '0' + month + "/" + day + "/" + year;
            console.log('ssss');
            console.log(formattedDate);


            const oldDate = getAppointment.date

            console.log('heeee');
            console.log(oldDate);
            if (oldDate == formattedDate) {
                console.log('hoooo');
                console.log('-------');
                console.log(getAppointment);
                console.log(req.file);
                let Name = `${req.file.path}${path.extname(req.file.originalname)}`
                console.log(Name)
                // fs.rename(req.file.path, Name, () => { })
                newEmr = new emr({
                    appointmentId: req.params.appointmentId,
                    path: Name,
                    name: req.file.originalname
                })
                console.log(newEmr);
                await newEmr.save();

            } else {
                console.log('aaaaaaaaaaa');
                throw Error()
            }

            res.status(200).send({
                apiStatues: true,
                newEmr,
                message: "Emr Added"
            })
        }
        catch (e) {
            console.log(e);
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "can't add emr",
            });
        }
    }

    static getEmr = async (req, res) => {
        try {
            console.log('aaaa' + ' ' + req.params.appointmentId);
            const getEmr = await emr.find({ appointmentId: req.params.appointmentId });
            res.status(200).send({
                apiStatues: true,
                getEmr,
                message: "All emr",
            });
        } catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "can't find emr",
            });
        }
    };

    static deleteEmrById = async (req, res) => {
        const _id = req.params.id
        try {
            const deleteEmrById = await emr.findByIdAndDelete(_id)

            res.status(200).send({
                apiStatues: true,
                deleteEmrById,
                message: "Delete emr"
            })
        } catch (e) {
            res.status(404).send({
                apiStatues: false,
                data: e.message,
                message: "can't delete emr",
            });
        }
    };
}


module.exports = Emr