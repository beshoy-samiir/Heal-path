const patient = require('../models/patientModel')

class Patient {

    static addPatient = async (req, res) => {
        try {
            console.log(req.body);
            const newPatient = new patient(req.body)
            const [day, month, year] = newPatient.BirthDate.split('/');
            const reversedDateString = `${month}/${day}/${year}`;
            newPatient.BirthDate = reversedDateString
            await newPatient.save()
            res.status(201).send({
                apiStatues: true,
                newPatient,
                message: "Patient Created"
            })
        } catch (e) {
            res.status(404).send({
                apiStatues: false,
                data: e.message,
                message: "can't add Patient",
            });
        }
    }

    static getPatients = async (req, res) => {
        try {
            const patients = await patient.find({})
            res.status(200).send({
                apiStatues: true,
                patients,
                message: "All Patients"
            })
        } catch (e) {
            res.status(404).send({
                apiStatues: false,
                data: e.message,
                message: "can't get Patients",
            });
        }
    }

    static getPatientById = async (req, res) => {
        const _id = req.params.id
        console.log(_id);
        try {
            const getpatient = await patient.findById(_id)

            res.status(200).send({
                apiStatues: true,
                getpatient,
                message: "Get Patient"
            })
        } catch (e) {
            res.status(404).send({
                apiStatues: false,
                data: e.message,
                message: "can't get Patient",
            });
        }
    }


    static deletePatientById = async (req, res) => {
        const _id = req.params.id

        try {
            const deletePatient = await patient.findByIdAndDelete(_id)

            res.status(200).send({
                apiStatues: true,
                deletePatient,
                message: "Delete Patient"
            })
        } catch (e) {
            res.status(404).send({
                apiStatues: false,
                data: e.message,
                message: "can't delete Patient",
            });
        }
    }

    static editPatient = async (req, res) => {
        try {
            const editPatient = await patient.findById(req.params.id)
            console.log(editPatient);
            let date;
            let parts;
            let formattedDate;
            if (editPatient) {
                editPatient.PatientName = req.body.PatientName;
                editPatient.PhoneNumber = req.body.PhoneNumber;
                date = req.body.Birthdate;
                parts = date.split("/");
                formattedDate = `${parts[1]}/${parts[0]}/${parts[2]}`;
                editPatient.BirthDate = formattedDate;
                editPatient.Height = req.body.Height;
                editPatient.Gender = req.body.Gender;
                await editPatient.save();
            }
            else {
                throw new Error("error");
            }
            res.status(200).send({
                apiStatues: true,
                editPatient,
                message: "edit Patient"
            })
        }
        catch (e) {
            res.status(404).send({
                apiStatues: false,
                data: e.message,
                message: "can't edit Patient",
            });
        }
    }
    static search = async (req, res) => {
        try {
            console.log(req.body);
            console.log(req.body.searchTerm);
            let patients = await patient.find({
                $or: [
                    { PatientName: { $regex: `(?i)${req.body.searchTerm}` } },
                    { PhoneNumber: { $regex: `(?i)${req.body.searchTerm}` } },
                ],
            });
            console.log(req.body.search);
            console.log(patients);
            if (patients.length <= 0) {
                res.send(" Patient Not Found ");
                return;
            }
            res.status(200).send(patients);
        } catch (error) {
            res.status(400).send(error.text);
        }
    };

}
module.exports = Patient