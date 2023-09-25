const mongoose = require("mongoose");

const appointment = mongoose.model("appointment", {
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Patient"
  },
  date: {
    type: String,
    required: true
  },

  time: {
    type: String,
    required: true
  }, 

  isAvaliable:{
    type:Boolean,
    required:true,
    default: true
  },
});

module.exports = appointment