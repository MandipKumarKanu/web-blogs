const Blog = require("../models/Blog");
const CronJobLog = require("../models/CronJobLog");
const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
};

module.exports = async (req, res) => {
  await connectDB();
  const startTime = new Date();
  
  try {
    const result = await Blog.updateMany(
      { scheduled: true, scheduledPublishDate: { $lte: startTime }, status: "scheduled" },
      { $set: { status: "published", publishedAt: startTime, scheduled: false } }
    );
    
    await CronJobLog.create({
      jobType: "publish-scheduled-blogs",
      startTime,
      endTime: new Date(),
      success: true,
      modifiedCount: result.modifiedCount
    });
    
    return res.status(200).json({
      success: true,
      message: `Published ${result.modifiedCount} blogs.`
    });
  } catch (error) {
    await CronJobLog.create({
      jobType: "publish-scheduled-blogs",
      startTime,
      endTime: new Date(),
      success: false,
      error: error.message
    });
    
    return res.status(500).json({ error: error.message });
  }
};
