const slugify = require("slugify");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const fs = require("fs");

module.exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      category,
      quantity,

      shipping,
    } = req.fields;
    const { photo } = req.files;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !photo ||
      !shipping
    ) {
      return res.status(401).json({
        success: false,
        message: "All Fields are Required",
      });
    }

    const products = await new productModel({
      ...req.fields,
      slug: slugify(name),
    });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();

    res.status(200).json({
      success: true,
      message: "Product Created",
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error Product Create",
      error: error.message,
    });
  }
};
module.exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      category,
      quantity,

      shipping,
    } = req.fields;
    const { photo } = req.files;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(401).json({
        success: false,
        message: "All Fields are Required",
      });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true },
    );

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();

    res.status(200).json({
      success: true,
      message: "Product Update",
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error Product Update",
      error: error.message,
    });
  }
};

module.exports.allProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .select("-photo")
      .sort({ createdAt: -1 })
      .populate("category");

    res.status(200).json({
      success: true,
      message: "All Product Get",
      TotalProduct: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error All Products",
      error: error.message,
    });
  }
};
module.exports.singleProduct = async (req, res) => {
  try {
    const Product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    res.status(200).json({
      success: true,
      message: " Product Get",
      Product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error Single Products",
      error: error.message,
    });
  }
};

module.exports.productPhoto = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error Product Photo",
      error: error.message,
    });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const product = await productModel
      .findByIdAndDelete(req.params.pid)
      .select("-photo");

    res.status(201).json({
      success: true,
      message: "Delete Product",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error Delete Products",
      error: error.message,
    });
  }
};

module.exports.productFilter = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};

    if (checked.length > 0) args.category = checked;

    if (radio.length === 2) {
      args.price = { $gte: radio[0], $lte: radio[1] };
    }

    const products = await productModel.find(args);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error Filter Products",
      error: error.message,
    });
  }
};

module.exports.totalProduct = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).json({
      success: true,
      message: "Total Products",
      total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error Total Products",
      error: error.message,
    });
  }
};

module.exports.productList = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * page)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error List Products",
      error: error.message,
    });
  }
};

module.exports.searchProduct = async (req, res) => {
  try {
    const { keyword } = req.params;

    const result = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error Search Products",
      error: error.message,
    });
  }
};

module.exports.relatedProduct = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .populate("category");

    res.status(200).json({
      message: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error Search Products",
      error: error.message,
    });
  }
};

module.exports.categoryProduct = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel
      .find({ category })
      .populate("category")
      .select("-photo");
    res.status(200).json({
      message: "Delete Category",
      success: true,
      category,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error Product Category",
    });
  }
};
