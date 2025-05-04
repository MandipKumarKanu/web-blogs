const Blog = require("../models/Blog");
const CronJobSummary = require("../models/CronJobSummary");
const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
};

module.exports = async (req, res) => {
  const apiKey = req.headers['x-api-key'] || req.query.key;
  if (apiKey !== process.env.CRON_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized access to cron job endpoint' });
  }
  
  await connectDB();
  const startTime = new Date();
  
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const result = await Blog.updateMany(
      { scheduled: true, scheduledPublishDate: { $lte: startTime }, status: "scheduled" },
      { $set: { status: "published", publishedAt: startTime, scheduled: false } }
    );
    
    await CronJobSummary.findOneAndUpdate(
      { date: today, jobType: "publish-scheduled-blogs" },
      { 
        $inc: { 
          totalRuns: 1,
          totalPublished: result.modifiedCount,
          successfulRuns: 1
        },
        $set: { lastRunAt: startTime }
      },
      { upsert: true, new: true }
    );
    
    return res.status(200).json({
      success: true,
      message: `Published ${result.modifiedCount} blogs.`
    });
  } catch (error) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await CronJobSummary.findOneAndUpdate(
      { date: today, jobType: "publish-scheduled-blogs" },
      { 
        $inc: { 
          totalRuns: 1,
          failedRuns: 1
        },
        $set: { 
          lastError: error.message,
          lastRunAt: startTime
        }
      },
      { upsert: true, new: true }
    );
    
    return res.status(500).json({ error: error.message });
  }
};
