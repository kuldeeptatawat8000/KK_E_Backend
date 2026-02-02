const express = require("express");
const router = express.Router();

const {
  createCategory,
  updateCategory,
  AllCategorys,
  SingleCategorys,
  deleteCategory,
} = require("../controllers/categoryControllers");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

router.post("/create-category", requireSignIn, isAdmin, createCategory);

router.put("/update-category/:id", requireSignIn, isAdmin, updateCategory);
router.get("/all-category", AllCategorys);
router.get("/single-category/:slug", SingleCategorys);
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteCategory);


module.exports = router;
