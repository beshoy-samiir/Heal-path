const mongoose = require("mongoose");

const vitals = mongoose.model("vitals", {

    patientId: {

        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Patient",
    },

    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "appointment"
    },

    temperature: {
        type: Number,
        required: true
    },

    upperBloodPressure: {
        type: Number,
        required: true
    },
    lowerBloodPressure: {
        type: Number,
        required: true
    },

    weight: {
        type: Number,
        required: true
    },
    oxygenSaturation: {
        type: Number,
        required: true
    },
    smookingStatus: {
        type: String,
        required: true,
        enum: ['Smoker', 'Non-Smoker'],
        default: 'Non-Smoker'
    },
});

module.exports = vitals;