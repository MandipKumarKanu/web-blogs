const Blog = require("../models/Blog");
const mongoose = require("mongoose");
const addCustomClassesToHtml = require("../utils/addCustomClass");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const createBlog = async (req, res) => {
  const { title, content, tags, categories, image, scheduledPublishDate } =
    req.body;

  if (!["author", "admin"].includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "You must be an author or admin to create a blog." });
  }

  try {
    const styledContent = addCustomClassesToHtml(content);

    const status = req.user.role === "admin" ? "published" : "pending";
    const publishDate = scheduledPublishDate
      ? new Date(scheduledPublishDate)
      : null;

    const blog = await Blog.create({
      title,
      content: styledContent,
      tags,
      categories,
      image,
      author: req.user.id,
      scheduledPublishDate: publishDate,
      scheduled: !!scheduledPublishDate,
      status,
      publishedAt: req.user.role === "admin" ? new Date() : null,
    });

    res.status(201).json({
      message: `Blog ${
        req.user.role === "admin"
          ? "published"
          : scheduledPublishDate
          ? "scheduled"
          : "pending"
      } successfully`,
      blog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllBlogs = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  // console.log(page, limit);
  const skip = (page - 1) * limit;

  try {
    const blogs = await Blog.find({ status: "published" })
      .populate("author", "name userName email profileImage")
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments({ status: "published" });
    const totalPages = Math.ceil(totalBlogs / limit);

    if (blogs.length === 0) {
      return res.status(400).json({ error: "No blogs found" });
    }

    res.status(200).json({ blogs, totalPages, currentPage: page });
  } catch (error) {
    res.status(500).error({ error });
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

    if (blogs.length === 0) {
      return res.status(400).json({ error: "No blogs found" });
    }

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

    if (blogs.length === 0) {
      return res.status(400).json({ error: "No blogs found" });
    }

    res.status(200).json({ blogs, totalPages, currentPage: page });
  } catch (error) {
    res.status(500).error({ error });
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
    res.status(500).error({ error });
  }
};

const summarizeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      throw new Error("Blog not found");
    }

    const prompt = `Summarize the following content by ignoring the HTML tags and providing at least 5 key points, you can give more for user to understand nicely in HTML list bullet form. Be concise and cover the most important aspects in easy term to be understand by simple people, if there is any date or time, mention that point too. Only return the HTML code without any explanations or extra text. The list should be in the following format:\n\n<ul class="list-disc ml-6 space-y-2 text-muted-foreground">\n  <li>...</li>\n  <li>...</li>\n</ul>\n\nContent:\n\n${blog.content}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      // console.log(response);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    // console.log(result);

    res.status(200).json({
      summary: result?.candidates?.[0].content?.parts?.[0].text,
    });
  } catch (error) {
    // console.error("Error summarizing blog:", error);
    res.status(500).json({ error: error.message });
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
    res.status(500).error({ error });
  }
};

const getByCategory = async (req, res, next) => {
  const { category } = req.query;

  if (!category)
    return res
      .status(400)
      .json({ error: "Please provide category for search" });

  try {
    let blogs;
    if (category === "All") {
      blogs = await Blog.find().populate("author", "name profileImage");
    } else {
      blogs = await Blog.find({ categories: category }).populate(
        "author",
        "name profileImage"
      );
    }
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const blogLikes = async (req, res) => {
  try {
    const userId = req.user.id;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (req.body.status !== undefined) {
      if (req.body.status) {
        await Blog.findByIdAndUpdate(
          req.params.id,
          { $addToSet: { likes: userId } },
          { new: true }
        );
      } else {
        await Blog.findByIdAndUpdate(
          req.params.id,
          { $pull: { likes: userId } },
          { new: true }
        );
      }
    }

    const updatedBlog = await Blog.findById(req.params.id);
    const isLiked = updatedBlog.likes.includes(userId);

    res.status(200).json({
      isLiked,
      likesCount: updatedBlog.likes.length,
    });
  } catch (error) {
    console.error("Error handling blog likes:", error);
    res.status(500).json({ error: error.message });
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

const getLatestBlogsByViews = async (req, res) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  try {
    const blogs = await Blog.find({
      createdAt: { $gte: oneWeekAgo },
      status: "published",
    })
      .populate("author", "name userName email profileImage")
      .sort({ views: -1 })
      .limit(10);

    if (blogs.length === 0) {
      return res.status(400).json({ error: "No blogs found" });
    }

    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPopularBlog = async (req, res) => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const blogs = await Blog.aggregate([
      {
        $match: { status: "published" },
      },
      {
        $addFields: {
          isRecent: { $cond: [{ $gte: ["$publishedAt", threeDaysAgo] }, 1, 0] },
        },
      },
      {
        $sort: { isRecent: -1, views: -1, publishedAt: -1 },
      },
      { $limit: 20 },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $project: {
          title: 1,
          content: 1,
          views: 1,
          publishedAt: 1,
          categories: 1,
          image: 1,
          isRecent: 1,
          "author.name": 1,
          "author.userName": 1,
          "author.email": 1,
          "author.profileImage": 1,
        },
      },
    ]);

    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Error fetching popular blogs:", error);
    res.status(500).json({ error });
  }
};

const incrementViews = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    blog.views += 1;
    await blog.save();
    res.status(200).json({ views: blog.views });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const incrementShares = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    blog.shares += 1;
    await blog.save();
    res.status(200).json({ shares: blog.shares });
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
  approveBlog,
  getAllUnApprovedBlogs,
  rejectBlog,
  getLatestBlogsByViews,
  incrementViews,
  getPopularBlog,
  summarizeBlog,
  incrementShares
};
