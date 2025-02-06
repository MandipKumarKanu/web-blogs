const express = require("express");
const {
  register,
  refresh,
  login,
  logout,
  update,
  getUserById,
  updatePassword,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.get("/refresh", refresh);
router.post("/login", login);
router.get("/logout", logout);
router.patch("/update", authMiddleware, update);
router.patch("/password", authMiddleware, updatePassword);
router.get("/user/:id", getUserById);

module.exports = router;
