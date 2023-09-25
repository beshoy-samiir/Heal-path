const vitals = require("../models/vitalsModel");


class Vitals {
    static addVitals = async (req, res) => {
        try {
            console.log(req.params.appointmentId);
            console.log(req.params.patientId);
            console.log(req.body);
            const newVitals = await vitals.findOne(
                {
                    appointmentId: req.params.appointmentId,
                    patientId: req.params.patientId
                }
            )
            if (newVitals) {
                newVitals.temperature = req.body.temperature;
                newVitals.upperBloodPressure = req.body.upperBloodPressure;
                newVitals.lowerBloodPressure = req.body.lowerBloodPressure;
                newVitals.weight = req.body.weight;
                newVitals.oxygenSaturation = req.body.oxygenSaturation;
                newVitals.smookingStatus = req.body.smookingStatus;
                await newVitals.save();

            } else {
                await new vitals({
                    patientId: req.params.patientId,
                    appointmentId: req.params.appointmentId,
                    temperature: req.body.temperature,
                    lowerBloodPressure: req.body.lowerBloodPressure,
                    upperBloodPressure: req.body.upperBloodPressure,
                    weight: req.body.weight,
                    oxygenSaturation: req.body.oxygenSaturation,
                    smookingStatus: req.body.smookingStatus,
                }).save();
            }
            res.status(200).send({
                apiStatues: true,
                newVitals,
                message: "vitals updated",
            });
        } catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "can't add vitals",
            });
        }
    };

    static getVitals = async (req, res) => {
        try {
            console.log(req.params.appointmentId);
            console.log(req.params.patientId);

            var getVitals = await vitals.findOne(
                {
                    appointmentId: req.params.appointmentId,
                    patientId: req.params.patientId
                }
            )
            if (getVitals) {
                res.status(200).send({
                    apiStatues: true,
                    getVitals,
                    message: "All vitals",
                });
            } else {
                getVitals = await vitals.findOne(
                    {
                        patientId: req.params.patientId
                    }
                )
                res.status(200).send({
                    apiStatues: true,
                    getVitals,
                    message: "All vitals",
                });
            }


        } catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "can't find vitals",
            });
        }
    };

    static deleteVitalById = async (req, res) => {
        const _id = req.params.id

        try {
            const deleteVitalById = await vitals.findByIdAndDelete(_id)

            res.status(200).send({
                apiStatues: true,
                deleteVitalById,
                message: "Delete Vital"
            })
        } catch (e) {
            res.status(404).send({
                apiStatues: false,
                data: e.message,
                message: "can't delete vital",
            });
        }
    };
}
module.exports = Vitals;
