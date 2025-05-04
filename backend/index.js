require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notificationRoute = require("./routes/notificationRoute");
const tagRoutes = require("./routes/tagRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const statsRoutes = require("./routes/statsRoutes");
const startCronJob = require("./cron");
const http = require("http");
const cronPublishHandler = require("./api/cron-publish-blogs");

const app = express();
const server = http.createServer(app);

connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://192.168.100.236:5173",
      "https://future-blogs.web.app",
      "https://futureblog.mandipkk.com.np",
    ],
    credentials: true,
  })
);

app.get("/api/cron-publish-blogs", cronPublishHandler);

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/notifications", notificationRoute);
app.use("/api/tags", tagRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stats", statsRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startCronJob();
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});
