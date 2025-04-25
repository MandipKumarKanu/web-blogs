const cron = require("node-cron");
const Blog = require("./models/Blog");

const startCronJob = () => {
  cron.schedule("*/5 * * * *", async () => {
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
