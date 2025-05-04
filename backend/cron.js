const cron = require("node-cron");
const Blog = require("./models/Blog");

const startCronJob = () => {
  console.log("Cron job scheduled to run every minute");
  
  cron.schedule("* * * * *", async () => {
    console.log("Cron job running at:", new Date().toISOString());
    const now = new Date();

    const result = await Blog.updateMany(
      {
        scheduled: true,
        scheduledPublishDate: { $lte: now },
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
      console.log(`${result.modifiedCount} scheduled blogs published at ${now}`);
    }
  });
};

module.exports = startCronJob;
