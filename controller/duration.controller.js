const duration = require('../models/durationModel')

class Duration {

    static addDuration = async (req, res) => {
        try {
            const newDuration = await duration.findOne({ doctorId: req.user._id })
            console.log(newDuration);
            if (newDuration) {
                newDuration.time = req.body.time
                await newDuration.save()
            } else {
                new duration({ doctorId: req.user._id, time: req.body.time }).save()
            }
            res.status(200).send({
                apiStatues: true,
                newDuration,
                message: "Duration Added"
            })
        } catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "can't add Duration",
            });
        }
    }

    static getDuration = async (req, res) => {
        try {
            const getDuration = await duration.findOne({ doctorId: req.user._id })
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

    static deleteDurationById = async (req, res) => {
        const _id = req.params.id

        try {
            const deleteDurationById = await duration.findByIdAndDelete(_id)

            res.status(200).send({
                apiStatues: true,
                deleteDurationById,
                message: "Delete Duration"
            })
        } catch (e) {
            res.status(404).send({
                apiStatues: false,
                data: e.message,
                message: "can't delete Duration",
            });
        }
    }
}



module.exports = Duration
