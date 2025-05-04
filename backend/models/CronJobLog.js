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
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }
}, { timestamps: true });

CronJobLogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("CronJobLog", CronJobLogSchema);