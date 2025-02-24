const cron = require("node-cron");
const Blog = require("./models/Blog");

const startCronJob = () => {
  cron.schedule("*/5 * * * *", async () => {
    const now = new Date();

    
    const blogsToPublish = await Blog.find({
      scheduled: true,
      scheduledPublishDate: { $lte: now },
      status: "scheduled",
    });
    console.log({ blogsToPublish });
    
    if (blogsToPublish.length > 0) {
      for (let blog of blogsToPublish) {
        blog.status = "published";
        blog.publishedAt = now;
        blog.scheduled = false;
        await blog.save();
        console.log(`Blog ${blog.title} published`);
      }
    }
  });
};

module.exports = startCronJob;
