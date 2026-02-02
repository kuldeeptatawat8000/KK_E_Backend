const categoryModel = require("../models/categoryModel");
const slugify = require("slugify");
const productModel = require("../models/productModel");

module.exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name, { lower: true }),
    }).save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in category controller",
      error,
    });
  }
};

module.exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name),
      },
      { new: true },
    );

    res.status(201).json({
      message: "Category Update Successfully",
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error Update Category",
    });
  }
};

module.exports.AllCategorys = async (req, res) => {
  try {
    const category = await categoryModel.find();
    res.status(201).json({
      message: "All Category Get",
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error All Get Category",
    });
  }
};

module.exports.SingleCategorys = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(201).json({
      message: "Single Category Get",
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error Single Get Category",
    });
  }
};

module.exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findByIdAndDelete(id);
    res.status(200).json({
      message: "Delete Category",
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error Delete Category",
    });
  }
};

