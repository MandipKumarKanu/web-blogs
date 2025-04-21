const Blog = require("../models/Blog");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const User = require("../models/User");

 const getStats = async (req, res) => {
  try {
    const totalCategories = await Category.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const totalTags = await Tag.countDocuments();

    const recentBlogs = await Blog.find()
      .select("title author createdAt")
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      stats: {
        totalCategories,
        totalUsers,
        totalBlogs,
        totalTags,
      },
      recentActivity: recentBlogs,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = getStats