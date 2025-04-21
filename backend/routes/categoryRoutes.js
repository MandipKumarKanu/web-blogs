const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  createCategory
);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  updateCategory
); 
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteCategory
); 

module.exports = router;