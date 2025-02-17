require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notificationRoute = require("./routes/notificationRoute");
const startCronJob = require("./corn");
const socketIo = require("socket.io");
const http = require("http");
const setupSocket = require("./socket");

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);
app.set("io", io);

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/notifications", notificationRoute);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // startCronJob();
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});
