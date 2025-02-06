const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByUserId,
  deleteBlog,
  updateBlog,
  searchBlogs,
  getByCategory,
  blogLikes,
} = require("../controllers/blogController");
const router = express.Router();

router.post("/", authMiddleware, createBlog);
router.get("/", getAllBlogs);
router.get("/search", searchBlogs);
router.get("/filter", getByCategory);
router.get("/:id", getBlogById);
router.delete("/:id", authMiddleware, deleteBlog);
router.patch("/:id", authMiddleware, updateBlog);
router.get("/author/:authorId", getBlogsByUserId);
router.post("/:id/like", authMiddleware, blogLikes);

module.exports = router;
