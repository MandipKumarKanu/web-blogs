const Tag = require("../models/Tag");

const createTag = async (req, res) => {
  const { name } = req.body;

  try {
    const f = await Tag.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
    if (f) {
      return res.status(400).json({ message: "Tag already exists" });
    }

    const tag = await Tag.create({ name: name.toLowerCase() });
    res.status(201).json({ message: "Tag created successfully", tag });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTags = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    let tags;
    const totalTags = await Tag.countDocuments();
    let totalPages = Math.ceil(totalTags / limit);

    if (limit === "all") {
      tags = await Tag.find().sort({ name: 1 });

      totalPages = 1;
    } else {
      const skip = (page - 1) * limit;
      tags = await Tag.find()
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ name: 1 });
    }

    res.status(200).json({
      tags,
      totalTags,
      totalPages,
      currentPage: limit === "all" ? 1 : parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTagById = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json({ tag });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTag = async (req, res) => {
  const { name } = req.body;

  try {
    const existingTag = await Tag.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
    if (existingTag) {
      return res
        .status(400)
        .json({ message: "Tag with this name already exists" });
    }

    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { name: name.toLowerCase() },
      { new: true }
    );

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.status(200).json({ message: "Tag updated successfully", tag });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
};
