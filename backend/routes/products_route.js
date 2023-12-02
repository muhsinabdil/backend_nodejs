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

//! controllers içinde yaptığımız işlemleri export etmiştik onları burada callback olarak routelara atıyoruz
//?client routers
router.get("/products", allProducts);
router.get("/products/:id", detailProduct);
router.post("/products/new", createProduct);
router.post("/products/newReview", createReview);
router.delete("/products/:id", deleteProduct);
router.put("/products/:id", updateProduct);

//? admin routes
router.get("/admin/products", adminAllProducts);

module.exports = router;
