const mongoose = require("mongoose");

const CronJobSummarySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  jobType: {
    type: String,
    required: true
  },
  totalRuns: {
    type: Number,
    default: 1
  },
  totalPublished: {
    type: Number,
    default: 0
  },
  successfulRuns: {
    type: Number,
    default: 0
  },
  failedRuns: {
    type: Number,
    default: 0
  },
  lastError: {
    type: String
  },
  lastRunAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("CronJobSummary", CronJobSummarySchema);