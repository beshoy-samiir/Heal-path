const mongoose = require('mongoose')

const durationModel = mongoose.model('Duration', {
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    time: {
        type: Number,
        required: true
    }
})

module.exports = durationModel