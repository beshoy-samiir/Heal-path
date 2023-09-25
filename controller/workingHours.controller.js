const workingHours = require('../models/workingHoursModel')

class WorkingHours {

    static addWorkingHours = async (req, res) => {
        try {
            const newWorkingHours = await workingHours.findOne({ doctorId: req.user._id })

            if (newWorkingHours) {
                newWorkingHours.workingHour.push({ day: req.body.day, startTime: req.body.startTime, endTime: req.body.endTime })
                await newWorkingHours.save()



            } else {
                let newdate = await new workingHours({ doctorId: req.user._id }).save()
                newdate.workingHour.push({ day: req.body.day, startTime: req.body.startTime, endTime: req.body.endTime })

                await newdate.save()
            }
            res.status(200).send({
                apiStatues: true,
                newWorkingHours,
                message: "Working Hours updated"
            })
        } catch (e) {
            res.status(400).send({
                apiStatues: false,
                data: e.message,
                message: "can't edit Working Hours",
            })
        }
    }

    static getWorkingHours = async (req, res) => {
        try {
            const newWorkingHours = await workingHours.find({ doctorId: req.user._id })
            res.status(200).send({
                apiStatues: true,
                newWorkingHours,
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
    static getWorkingHoursByDate = async (req, res) => {
        try {
            const newWorkingHours = await workingHours.findOne({ doctorId: req.user._id, })
            let workingHoursByDate;
            console.log(newWorkingHours);
            console.log(req.params.day);
            if (newWorkingHours) {
                workingHoursByDate = newWorkingHours.workingHour.filter(hours => hours.day === req.params.day);
                console.log(workingHoursByDate);
            }
            res.status(200).send({
                apiStatues: true,
                workingHoursByDate,
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

    static deleteWorkingHoursById = async (req, res) => {
        const _id = req.params.id

        try {
            const deleteWorkingHoursById = await workingHours.findByIdAndDelete(_id)

            res.status(200).send({
                apiStatues: true,
                deleteWorkingHoursById,
                message: "Delete Working Hours"
            })
        } catch (e) {
            res.status(404).send({
                apiStatues: false,
                data: e.message,
                message: "can't delete Working Hours",
            });
        }
    }

}
module.exports = WorkingHours
