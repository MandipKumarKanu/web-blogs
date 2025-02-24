const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: { type: String },
    content: { type: String, required: true },
    tags: [{ type: String }],
    categories: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }],
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true },
    ],
    scheduledPublishDate: { type: Date, required: false },
    scheduled: { type: Boolean, default: false },
    publishedAt: { type: Date },
    status: {
      type: String,
      enum: ["pending", "approved", "published", "rejected", "scheduled"],
      default: "pending",
    },
    rejectionMessage: { type: String, required: false },
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
