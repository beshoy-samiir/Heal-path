const dayOff = require('../models/dayOffModel')

class DayOff {

    static addDayOff = async (req, res) => {
        try {
            const newDayOff = await dayOff.findOne({ doctorId: req.user._id })
            if (newDayOff) {
                newDayOff.day = req.body.day
                await newDayOff.save()
            } else {
                new dayOff({ doctorId: req.user._id, day: req.body.day }).save()
            }
            res.status(200).send({
                apiStatues: true,
                newDayOff,
                message: "DaysOFF updated"
            })
        } catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "can't edit DaysOFF",
            })
        }
    }

    static getDayOff = async (req, res) => {
        try {
            const getDayOff = await dayOff.find({ doctorId: req.user._id })
            res.status(200).send({
                apiStatues: true,
                getDayOff,
                message: "All DaysOFF"
            })
        } catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "can't find DaysOFF",
            });
        }
    }

    static deleteDayOffById = async (req, res) => {
        const _id = req.params.id

        try {
            const deleteDayOffById = await dayOff.findByIdAndDelete(_id)

            res.status(200).send({
                apiStatues: true,
                deleteDayOffById,
                message: "Delete Day Off"
            })
        } catch (e) {
            res.status(404).send({
                apiStatues: false,
                data: e.message,
                message: "can't delete Dat off",
            });
        }
    }
}
module.exports = DayOff
