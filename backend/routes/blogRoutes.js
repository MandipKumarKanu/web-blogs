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
  approveBlog,
  rejectBlog,
  getAllUnApprovedBlogs,
} = require("../controllers/blogController");
const roleMiddleware = require("../middleware/roleMiddleware");
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["author", "admin"]),
  createBlog
);
router.get("/", getAllBlogs);
router.get("/search", searchBlogs);
router.get("/filter", getByCategory);
router.get("/unapproved", authMiddleware, roleMiddleware(["admin"]), getAllUnApprovedBlogs);
router.get("/:id", getBlogById);
router.delete("/:id", authMiddleware, deleteBlog);
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["author", "admin"]),
  updateBlog
);
router.get("/author/:authorId", getBlogsByUserId);
router.post("/:id/like", authMiddleware, blogLikes);
router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware(["admin"]),
  approveBlog
);
router.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware(["admin"]),
  rejectBlog
);

module.exports = router;
