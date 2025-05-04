const Category = require("../models/Category");

const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const f = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
    if (f) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name: name.toLowerCase(),
      description,
    });
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    let categories;
    const totalCategories = await Category.countDocuments();
    let totalPages = Math.ceil(totalCategories / limit);

    if (limit === "all") {
      categories = await Category.find().sort({ name: 1 });

      totalPages = 1;
    } else {
      const skip = (page - 1) * limit;
      categories = await Category.find()
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ name: -1 });
    }

    return res.status(200).json({
      categories,
      totalCategories,
      totalPages,
      currentPage: limit === "all" ? 1 : parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const existingCategory = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists" });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: name.toLowerCase(), description },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
