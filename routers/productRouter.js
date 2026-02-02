const express = require("express");
const {
  createProduct,
  allProducts,
  singleProduct,
  productPhoto,
  deleteProduct,
  updateProduct,
  productFilter,
  totalProduct,
  productList,
  searchProduct,
  relatedProduct,
  categoryProduct,
} = require("../controllers/productControllers");
const router = express.Router();
const { isAdmin, requireSignIn } = require("../middlewares/authMiddleware");
const formidable = require("express-formidable");

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProduct,
);

router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProduct,
);
router.get("/all-products", allProducts);
router.get("/single-product/:slug", singleProduct);
router.get("/product-photo/:pid", productPhoto);
router.delete("/delete-product/:pid", requireSignIn, isAdmin, deleteProduct);
router.post("/product-filter", productFilter);

// Total Products
router.get("/total-product", totalProduct);
router.get("/product-list/:page", productList);
router.get("/search-product/:keyword", searchProduct);
router.get("/related-product/:pid/:cid", relatedProduct);
router.get("/category-product/:slug", categoryProduct);

module.exports = router;
