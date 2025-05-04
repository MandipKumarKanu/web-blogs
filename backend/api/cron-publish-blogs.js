const Blog = require("../models/Blog");
const connectDB = require("../config/db");

module.exports = async (req, res) => {
  try {
    await connectDB();

    console.log("Publishing cron job running at:", new Date().toISOString());
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await Blog.updateMany(
      {
        scheduled: true,
        scheduledPublishDate: { $lte: today },
        status: "scheduled",
      },
      {
        $set: {
          status: "published",
          publishedAt: now,
          scheduled: false,
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(
        `${result.modifiedCount} scheduled blogs published for ${
          today.toISOString().split("T")[0]
        }`
      );
    } else {
      console.log(
        `No pending scheduled blogs found for publishing at ${now.toISOString()}`
      );
    }

    return res.status(200).json({
      success: true,
      timestamp: now.toISOString(),
      publishedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return res
      .status(500)
      .json({ error: "Failed to run scheduled publishing" });
  }
};
