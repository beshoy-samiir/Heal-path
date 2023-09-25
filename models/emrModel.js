const mongoose = require("mongoose");

const emr = mongoose.model("emr", {

    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Appointment"
    },

    path: {
        type: String,
        default: Date.now()
    },

    name: {
        type: String,
        require: true
    }

})



module.exports = emr
