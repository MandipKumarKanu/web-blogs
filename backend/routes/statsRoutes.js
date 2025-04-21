const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const getStats = require("../controllers/statsController");

const router = express.Router();

router.get("/", authMiddleware, roleMiddleware(["admin"]), getStats);

module.exports = router;
