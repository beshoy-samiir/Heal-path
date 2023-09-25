const mongoose = require("mongoose");

const workingHours = mongoose.model("WorkingHours", {
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  workingHour: [
    {
      day: {
        type: String,

      },

      startTime: {
        type: String,

      },

      endTime: {
        type: String,
      }
    }
  ]

});

module.exports = workingHours;
