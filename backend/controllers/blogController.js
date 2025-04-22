const Blog = require("../models/Blog");
const mongoose = require("mongoose");
const addCustomClassesToHtml = require("../utils/addCustomClass");
const Notification = require("../models/Notification");
const { updateUserInterests } = require("../utils/helper");
const User = require("../models/User");
// const { io } = require("../server");
// const { post } = require("../routes/notificationRoute");
const levenshtein = require("fast-levenshtein");

const createBlog = async (req, res) => {
  const { title, content, tags, category, image, scheduledPublishDate } =
    req.body;

  try {
    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ error: "Tags must be a non-empty array." });
    }
    if (tags.length > 3) {
      return res
        .status(400)
        .json({ error: "You can select a maximum of 3 tags." });
    }

    if (!Array.isArray(category) || category.length === 0) {
      return res
        .status(400)
        .json({ error: "Category must be a non-empty array." });
    }
    if (category.length > 1) {
      return res
        .status(400)
        .json({ error: "You can select a maximum of 1 categories." });
    }

    const styledContent = addCustomClassesToHtml(content);

    const blog = await Blog.create({
      title,
      content: styledContent,
      tags,
      category,
      image,
      author: req.user.id,
      scheduledPublishDate: scheduledPublishDate || null,
      scheduled: !!scheduledPublishDate,
      status: "published",
      publishedAt: scheduledPublishDate
        ? new Date(scheduledPublishDate)
        : new Date(),
    });

    res.status(201).json({
      message: `Blog published successfully`,
      blog,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllBlogs = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const blogs = await Blog.find({ status: "published" })
      .populate("author", "name userName email profileImage")
      .populate("category", "name")
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
    res.status(500).json({ error });
  }
};

const getAllUnApprovedBlogs = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const blogs = await Blog.find({ status: "pending" })
      .populate("author", "name userName email profileImage")
      .populate("likes", "name profileImage")
      .populate("category", "name")
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments({ status: "pending" });
    const totalPages = Math.ceil(totalBlogs / limit);

    if (blogs.length === 0) {
      return res.status(400).json({ error: "No blogs found" });
    }

    res.status(200).json({ blogs, totalPages, currentPage: page });
  } catch (error) {
    res.status(500).json({ error });
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
      .populate("likes", "name profileImage")
      .populate("comments")
      .populate("category", "name");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBlogsByUserId = async (req, res, next) => {
  const { page = 1, limit = null } = req.query;
  const skip = (page - 1) * limit;

  try {
    const blogs = await Blog.find({ author: req.params.authorId })
      .populate("author", "name userName email profileImage")
      .populate("category", "name")
      .skip(skip)
      .limit(limit)
      .sort({ publishedAt: -1 });

    const totalBlogs = await Blog.countDocuments({
      author: req.params.authorId,
    });
    const totalPages = Math.ceil(totalBlogs / limit);

    if (blogs.length === 0) {
      return res.status(400).json({ error: "No blogs found" });
    }

    res.status(200).json({ blogs, totalPages, currentPage: page });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this blog" });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
};

const updateBlog = async (req, res) => {
  const { title, content, image, category, tags, scheduledPublishDate } =
    req.body;
  try {
    const styledContent = addCustomClassesToHtml(content);

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You do not have permission to update this blog." });
    }

    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ error: "Tags must be a non-empty array." });
    }
    if (tags.length > 3) {
      return res
        .status(400)
        .json({ error: "You can select a maximum of 3 tags." });
    }

    if (!Array.isArray(category) || category.length === 0) {
      return res
        .status(400)
        .json({ error: "Category must be a non-empty array." });
    }
    if (category.length > 1) {
      return res
        .status(400)
        .json({ error: "You can select a maximum of 1 categories." });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content: styledContent,
        image,
        category,
        tags,
        scheduledPublishDate,
      },
      { new: true }
    ).populate("author", "name email");

    res
      .status(200)
      .json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    return res.status(500).json({ message: "Internal server error" });
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

  const now = new Date();

  if (blog.scheduled) {
    if (now >= blog.scheduledPublishDate) {
      blog.status = "published";
      blog.publishedAt = now;
    } else {
      blog.status = "scheduled";
      blog.publishedAt = null;
    }
  } else {
    blog.status = "published";
    blog.publishedAt = now;
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
    const blogs = await Blog.find({ tags: { $in: tagsArray }, status: "published" }) // Add status filter
      .populate("author", "name profileImage")
      .populate("category", "name");
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
      blogs = await Blog.find({ status: "published" })
        .populate("author", "name profileImage")
        .populate("category", "name")
        .populate("comments");
    } else {
      blogs = await Blog.find({ category: category, status: "published" })
        .populate("category", "name")
        .populate("author", "name profileImage")
        .populate("comments");
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

    // const io = req.app.get("io");

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

        // const notification = new Notification({
        //   userId: blog.author,
        //   type: "like",
        //   message: `User liked your post!`,
        //   postId: blog._id,
        // });

        // await notification.save();
        // io.to(blog.author.toString()).emit("newNotification", notification);
        updateUserInterests(userId, blog.category);
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
      .populate("category", "name")

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
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

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
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categories",
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

    const totalBlogs = await Blog.countDocuments({ status: "published" });
    const totalPages = Math.ceil(totalBlogs / limit);

    res.status(200).json({
      blogs,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching popular blogs:", error);
    res.status(500).json({ error });
  }
};

const getPopularBlogsOfMonth = async (req, res) => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    let blogs = await Blog.aggregate([
      {
        $match: { status: "published", publishedAt: { $gte: oneMonthAgo } },
      },
      {
        $sort: { views: -1, publishedAt: -1 },
      },
      { $limit: 3 },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
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
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          content: { $first: "$content" },
          views: { $first: "$views" },
          publishedAt: { $first: "$publishedAt" },
          image: { $first: "$image" },
          category: { $first: "$category" },
          author: { $first: "$author" },
        },
      },
      {
        $project: {
          title: 1,
          content: 1,
          views: 1,
          publishedAt: 1,
          image: 1,
          "category.name": 1,
          "author.name": 1,
          "author.userName": 1,
          "author.email": 1,
          "author.profileImage": 1,
        },
      },
    ]);

    if (blogs.length === 0) {
      blogs = await Blog.aggregate([
        {
          $match: { status: "published" },
        },
        {
          $sort: { publishedAt: -1 },
        },
        { $limit: 3 },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
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
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            content: { $first: "$content" },
            views: { $first: "$views" },
            publishedAt: { $first: "$publishedAt" },
            image: { $first: "$image" },
            category: { $first: "$category" },
            author: { $first: "$author" },
          },
        },
        {
          $project: {
            title: 1,
            content: 1,
            views: 1,
            publishedAt: 1,
            image: 1,
            "category.name": 1,
            "author.name": 1,
            "author.userName": 1,
            "author.email": 1,
            "author.profileImage": 1,
          },
        },
      ]);
    }

    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Error fetching popular blogs of the month:", error);
    res.status(500).json({ error: error.message });
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

const getBlogsByCategoryPage = async (req, res) => {
  const { categories } = req.body;

  if (!Array.isArray(categories) || categories.length === 0) {
    return res
      .status(400)
      .json({ message: "Categories must be an array and cannot be empty." });
  }

  try {
    const blogs = await Blog.find({ category: { $in: categories }, status: "published" }) 
      .sort({ createdAt: -1 })
      .populate("author", "name userName email profileImage")
      .populate("likes", "name profileImage");

    const blogsByCategoryGrp = categories.map((category) => ({
      category,
      blogs: blogs
        .filter((blog) => blog.category.includes(category))
        .slice(0, 5),
    }));

    return res.status(200).json({ blogsByCategoryGrp });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

const getRecommendedBlogs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const blog = await Blog.find({
      tags: { $in: user.interests },
      status: "published",
    })
      .sort({ likes: -1, createdAt: -1 })
      .limit(5);

    return res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchBlogByQuery = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Please provide a search query" });
    }

    const queryWords = q.toLowerCase().split(" ");
    const blogs = await Blog.find({ status: "published" }, "title")
      .select("title category tags createdAt status author")
      .populate("author", "name email")

      .populate("category", "name")
      .populate("tags", "name");

    const results = blogs
      .map((blog) => {
        const titleWords = blog.title.toLowerCase().split(" ");
        let matchScore = 0;

        queryWords.forEach((queryWord) => {
          titleWords.forEach((titleWord) => {
            if (queryWord.length < 3) {
              if (queryWord === titleWord) {
                matchScore++;
              }
            } else {
              const distance = levenshtein.get(queryWord, titleWord);
              if (distance <= 2) {
                matchScore++;
              }
            }
          });
        });

        return { blog, matchScore };
      })
      .filter((result) => result.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .map((result) => result.blog);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const getAllBlogsForAdmin = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const blogs = await Blog.find()
      .select("title category tags createdAt author status")
      .populate("author", "name email")
      .populate("category", "name")
      .populate("tags", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);

    res.status(200).json({
      blogs,
      totalBlogs,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching blogs for admin:", error);
    res.status(500).json({ error: error.message });
  }
};

const getContentBasedRecommendations = async (req, res) => {
  const { interests } = req.body;
  const userId = req.user ? req.user.id : null;

  try {
    let recommendations = [];

    if (Array.isArray(interests) && interests.length > 0) {
      const blogs = await Blog.find({
        category: { $in: interests },
        status: "published",
        // ...(userId && { likes: { $ne: userId } }),
      })
        .sort({ createdAt: -1 })
        .populate("author", "name")
        .populate("category", "name")
        .populate("tags", "name");

      const shuffledBlogs = blogs.sort(() => Math.random() - 0.5);
      recommendations = shuffledBlogs.slice(0, 12);
    } else {
      recommendations = await Blog.aggregate([
        { $match: { status: "published" } },
        { $sample: { size: 12 } },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        { $unwind: "$author" },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $lookup: {
            from: "tags",
            localField: "tags",
            foreignField: "_id",
            as: "tags",
          },
        },
        {
          $project: {
            title: 1,
            content: 1,
            "author.name": 1,
            "category.name": 1,
            "tags.name": 1,
            createdAt: 1,
            image: 1,
          },
        },
      ]);
    }

    res.status(200).json({ recommendations });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
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
  incrementShares,
  getBlogsByCategoryPage,
  getPopularBlogsOfMonth,
  getRecommendedBlogs,
  searchBlogByQuery,
  getAllBlogsForAdmin,
  getContentBasedRecommendations,
};
