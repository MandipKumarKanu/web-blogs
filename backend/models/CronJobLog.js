const mongoose = require("mongoose");

const CronJobLogSchema = new mongoose.Schema({
  jobType: {
    type: String,
    required: true,
    enum: ["publish-scheduled-blogs"]
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  success: {
    type: Boolean,
    required: true
  },
  modifiedCount: {
    type: Number,
    default: 0
  },
  error: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("CronJobLog", CronJobLogSchema);