const express = require("express");
const {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
} = require("../controllers/tagController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  createTag
); 
router.get("/", getAllTags);
router.get("/:id", getTagById);
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  updateTag
); 
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteTag
); 

module.exports = router;