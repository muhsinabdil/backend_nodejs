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
const {
  authenticationMiddleware,
  roleChecked,
} = require("../middlewares/auth_middleware.js");
//!
//!  avatarı eklemedim 1.50.00 dakikadan sonrası https://youtu.be/B4_IwQZqVAM
//!

const router = express.Router();

//! controllers içinde yaptığımız işlemleri export etmiştik onları burada callback olarak routelara atıyoruz
//?client routers
router.get("/products", allProducts);
router.get("/products/:id", detailProduct);
router.post("/products/new", authenticationMiddleware, createProduct); //! login olmasını istedik
router.post("/products/newReview", authenticationMiddleware, createReview); //! login olmasını istedik
router.delete(
  "/products/:id",
  authenticationMiddleware,
  roleChecked("admin"),
  deleteProduct
); //! login olmasını istedik aynı zamanda admin olup olmadığına baktık
router.put(
  "/products/:id",
  authenticationMiddleware,
  roleChecked("admin"),
  updateProduct
); //! login olmasını istedik aynı zamanda admin olup olmadığına baktık

//? admin routes
//! login olmasını istedik aynı zamanda admin olup olmadığına baktık
router.get(
  "/admin/products",
  authenticationMiddleware,
  roleChecked("admin"),
  adminAllProducts
);

module.exports = router;
