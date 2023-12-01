const express = require("express");
const {
  allProducts,
  adminAllProducts,
  detailProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  createReview,
} = require("../controllers/product_controller.js");

const router = express.Router();

router.get("/products", allProducts);
router.get("/admin/products", adminAllProducts);
router.get("/products/:id", detailProduct);
router.post("/products/new", createProduct);
router.post("/products/newReview", createReview);
//router.delete("/products/:id", this.delete);
router.put("/products/:id", updateProduct);

module.exports = router;
