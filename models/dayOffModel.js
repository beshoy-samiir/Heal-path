const mongoose = require("mongoose");

const dayOff = mongoose.model("dayOff", {
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  day: {
    type: String,
    required: true,
  }
});

module.exports = dayOff
