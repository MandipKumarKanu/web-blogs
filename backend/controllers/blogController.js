const Blog = require("../models/Blog");

const createBlog = async (req, res) => {
  const { title, content, tags, categories, image } = req.body;

  try {
    const blog = await Blog.create({
      title,
      content,
      tags,
      categories,
      image,
      author: req.user.id,
    });

    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name userName email profileImage")
      .populate("likes", "name profileImage");

    if (blogs.length === 0)
      return res.status(204).json({ message: "No blogs found" });

    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name userName email profileImage")
      .populate("likes", "name profileImage");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBlogsByUserId = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.authorId });

    if (!blogs) {
      return res.status(204).json({ message: "No post from this user" });
    }

    if (blogs.length === 0)
      return res.status(204).json({ message: "No blogs found" });

    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (req.user.id !== blog.author.toString())
      return res.status(403).json({ error: "Unauthorized" });

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (req.user.id !== blog.author.toString())
      return res.status(403).json({ error: "Unauthorized" });

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchBlogs = async (req, res) => {
  const { tags } = req.query;

  if (!tags)
    return res.status(400).json({ error: "Please provide tags for search" });

  const tagsArray = tags.split(",").map((tag) => tag.trim());
  try {
    const blogs = await Blog.find({ tags: { $in: tagsArray } });
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getByCategory = async (req, res) => {
  const { category } = req.query;

  if (!category)
    return res
      .status(400)
      .json({ error: "Please provide category for search" });

  try {
    const blogs = await Blog.find({ categories: category });
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const blogLikes = async (req, res) => {
  try {
    const userId = req.user.id;
    const blog = await Blog.findOne({
      _id: req.params.id,
      likes: { $elemMatch: { $eq: userId } },
    });

    if (!blog) {
      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        { $push: { likes: userId } },
        { new: true }
      );
      // .populate("author", "name profileImage");

      return res.status(200).json({
        message: "Blog liked successfully",
        blog: updatedBlog,
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: userId } },
      { new: true }
    );
    // .populate("author", "name profileImage");

    return res.status(200).json({
      message: "Like removed successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByUserId,
  deleteBlog,
  updateBlog,
  searchBlogs,
  getByCategory,
  blogLikes,
};
