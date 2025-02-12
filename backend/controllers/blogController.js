const Blog = require("../models/Blog");
const mongoose = require("mongoose");
//const { validationResult } = require("express-validator");

const createBlog = async (req, res, next) => {
  const { title, content, tags, categories, image, scheduledPublishDate } =
    req.body;

  if (req.user.role !== "author" && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "You must be an author or admin to create a blog." });
  }

  try {
    const status = scheduledPublishDate ? "pending" : "pending";
    const publishDate = scheduledPublishDate
      ? new Date(scheduledPublishDate)
      : null;

    const blog = await Blog.create({
      title,
      content,
      tags,
      categories,
      image,
      author: req.user.id,
      scheduledPublishDate: publishDate,
      scheduled: !!scheduledPublishDate,
      status,
      publishedAt: null,
    });

    res.status(201).json({
      message: `Blog ${
        scheduledPublishDate ? "scheduled" : "created"
      } successfully`,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBlogs = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const blogs = await Blog.find({ status: "published" })
      .populate("author", "name userName email profileImage")
      .populate("likes", "name profileImage")
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments({ status: "published" });
    const totalPages = Math.ceil(totalBlogs / limit);

    res.status(200).json({ blogs, totalPages, currentPage: page });
  } catch (error) {
    next(error);
  }
};

const getAllUnApprovedBlogs = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const blogs = await Blog.find({ status: "pending" })
      .populate("author", "name userName email profileImage")
      .populate("likes", "name profileImage")
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments({ status: "pending" });
    const totalPages = Math.ceil(totalBlogs / limit);

    res.status(200).json({ blogs, totalPages, currentPage: page });
  } catch (error) {
    res.status(500).error({ error });
  }
};

const getBlogById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }

  try {
    const blog = await Blog.findById(id)
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

const getBlogsByUserId = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const blogs = await Blog.find({ author: req.params.authorId })
      .populate("author", "name userName email profileImage")
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments({
      author: req.params.authorId,
    });
    const totalPages = Math.ceil(totalBlogs / limit);

    res.status(200).json({ blogs, totalPages, currentPage: page });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id,
    });

    if (!blog)
      return res.status(404).json({ error: "Blog not found or unauthorized" });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res) => {
  const { title, content } = req.body;
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You do not have permission to update this blog." });
    }

    blog.title = title;
    blog.content = content;
    await blog.save();

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};

const approveBlog = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "You must be an admin to approve blogs." });
  }

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  if (blog.scheduled) {
    blog.status = "approved";
  } else {
    blog.status = "published";
    blog.publishedAt = new Date();
  }
  await blog.save();

  res.status(200).json({ message: "Blog approved successfully", blog });
};

const searchBlogs = async (req, res, next) => {
  const { tags } = req.query;

  if (!tags)
    return res.status(400).json({ error: "Please provide tags for search" });

  const tagsArray = tags.split(",").map((tag) => tag.trim());

  try {
    const blogs = await Blog.find({ tags: { $in: tagsArray } }).populate(
      "author",
      "name profileImage"
    );
    res.status(200).json({ blogs });
  } catch (error) {
    next(error);
  }
};

const getByCategory = async (req, res, next) => {
  const { category } = req.query;

  if (!category)
    return res
      .status(400)
      .json({ error: "Please provide category for search" });

  try {
    const blogs = await Blog.find({ categories: category }).populate(
      "author",
      "name profileImage"
    );
    res.status(200).json({ blogs });
  } catch (error) {
    next(error);
  }
};

const blogLikes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const isLiked = blog.likes.includes(userId);

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      isLiked ? { $pull: { likes: userId } } : { $push: { likes: userId } },
      { new: true }
    ).populate("likes", "name profileImage");

    res.status(200).json({
      message: isLiked
        ? "Like removed successfully"
        : "Blog liked successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

const rejectBlog = async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "You must be an admin to reject blogs." });
  }

  const { message } = req.body;
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.status = "rejected";
    blog.rejectionMessage = message;
    await blog.save();

    res.status(200).json({ message: "Blog rejected successfully", blog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error rejecting blog", error: error.message });
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
  approveBlog,
  getAllUnApprovedBlogs,
  rejectBlog,
};
