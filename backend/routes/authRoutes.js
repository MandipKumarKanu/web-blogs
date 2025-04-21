const express = require("express");
const {
  register,
  refresh,
  login,
  logout,
  update,
  getUserById,
  updatePassword,
  getAllUser,
  updateUserRole,
  createUserByAdmin,
  resetPasswordByAdmin,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const router = express.Router();

router.post("/register", register);
router.get("/refresh", refresh);
router.post("/login", login);
router.get("/logout", logout);
router.patch("/update", authMiddleware, update);
router.patch("/password", authMiddleware, updatePassword);
router.get("/user/:id", getUserById);
router.get(
  "/admin/users",
  authMiddleware,
  roleMiddleware(["admin"]),
  getAllUser
);
router.patch(
  "/admin/users/role",
  authMiddleware,
  roleMiddleware(["admin"]),
  updateUserRole
);
router.post(
  "/admin/create-user",
  authMiddleware,
  roleMiddleware(["admin"]),
  createUserByAdmin
);
router.patch(
  "/admin/reset-password",
  authMiddleware,
  roleMiddleware(["admin"]),
  resetPasswordByAdmin
);

module.exports = router;
