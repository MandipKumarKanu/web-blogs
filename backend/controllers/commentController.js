const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

const createComment = async (req, res) => {
  const { blogId, content, parentComment } = req.body;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = await Comment.create({
      blogId,
      author: req.user.id,
      content,
      parentComment: parentComment || null,
    });

    blog.comments.push(comment._id);
    await blog.save();

    return res.status(201).json({ message: "Comment Added", comment });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const getCommentByBlog = async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId })
      .populate("author", "name profileImage userName")
      .populate("likes", "name profileImage")
      .sort({ createdAt: -1 })
      .lean();

    const commentMap = comments.reduce((acc, comment) => {
      acc[comment._id.toString()] = { ...comment, replies: [] };
      return acc;
    }, {});

    const rootComments = [];
    comments.forEach((comment) => {
      if (comment.parentComment) {
        commentMap[comment.parentComment.toString()]?.replies.push(comment);
      } else {
        rootComments.push(comment);
      }
    });

    return res.status(200).json({
      comments: rootComments.concat(
        Object.values(commentMap).filter((c) => c.parentComment)
      ),
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

const likeComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const comment = await Comment.findOne({
      _id: req.params.id,
      likes: { $elemMatch: { $eq: userId } },
    });

    if (!comment) {
      const updatedComment = await Comment.findByIdAndUpdate(
        req.params.id,
        { $push: { likes: userId } },
        { new: true }
      );

      return res.status(200).json({
        message: "Comment liked successfully",
        comment: updatedComment,
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: userId } },
      { new: true }
    );
    // .populate("author", "name profileImage");

    return res.status(200).json({
      message: "Like removed successfully",
      comment: updatedComment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (req.user.id !== comment.author.toString())
      return res.status(403).json({ error: "Unauthorized" });

    await Comment.deleteMany({
      $or: [{ _id: comment._id }, { parentComment: { $in: [comment._id] } }],
    });

    res.status(200).json({ message: "Comment and replies deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (String(comment.author) !== String(req.user.id))
      return res.status(403).json({ error: "Unauthorized" });

    comment.content = content;
    await comment.save();

    res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createComment,
  getCommentByBlog,
  likeComment,
  deleteComment,
  updateComment,
};
