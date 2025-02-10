const cron = require("node-cron");
const Blog = require("./models/Blog");

const startCronJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    const now = new Date();

    const blogsToPublish = await Blog.find({
      scheduledPublishDate: { $lte: now },
      status: "scheduled",
    });

    if (blogsToPublish.length > 0) {
      for (let blog of blogsToPublish) {
        blog.status = "published";
        blog.publishedAt = now;
        await blog.save();
        console.log(`Blog ${blog.title} published`);
      }
    }
  });
};

module.exports = startCronJob;
