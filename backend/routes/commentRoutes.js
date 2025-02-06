const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createComment,
  getCommentByBlog,
  likeComment,
  deleteComment,
  updateComment,
} = require("../controllers/commentController");

router.post("/", authMiddleware, createComment);
router.get("/:blogId", getCommentByBlog);
router.delete("/:id", authMiddleware, deleteComment);
router.post("/:id/like", authMiddleware, likeComment);
router.patch("/:commentId", authMiddleware, updateComment);

module.exports = router;
