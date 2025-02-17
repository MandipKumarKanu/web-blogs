const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const getNotification = require("../controllers/notificationController");
const router = express.Router();

router.get("/", authMiddleware, getNotification);

module.exports = router;
