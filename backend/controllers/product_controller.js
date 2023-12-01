const productModel = require("../models/product_model.js");
const ProductFilter = require("../utils/product_filter.js");

const { publicDecrypt } = require("crypto");

const allProducts = async (req, res) => {
  const resultPerPage = 10;
  const productFilter = new ProductFilter(productModel.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await productFilter.query;
  res.status(200).json({ products });
};

const adminAllProducts = async (req, res) => {
  const products = await productModel.find();

  res.status(200).json({ products });
};

const detailProduct = async (req, res) => {
  const product = await productModel.findById(req.params.id);
  res.status(200).json({ product });
};

const createProduct = async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  let allImage = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "products",
    });
    allImage.push({ public_id: result.public_id, url: result.secure_url });
  }
  req.body.images = allImage;

  const product = await productModel.create(req.body);
  res.status(201).json({ product });
};

const deleteProduct = async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  for (let i = 0; i < product.images.length; i++) {
    const result = await cloudinary.uploader.destroy(
      product.images[i].public_id
    );
  }

  await product.remove();

  res.status(200).json({ message: "Ürün silindi" });
};

const updateProduct = async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    //image uploads
    for (let i = 0; i < product.images.length; i++) {
      const result = await cloudinary.uploader.destroy(
        product.images[i].public_id
      );
    }
  }

  let allImage = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "products",
    });
    allImage.push({ public_id: result.public_id, url: result.secure_url });
  }
  req.body.images = allImage;

  product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ product });
};

const createReview = async (req, res, next) => {
  const { productId, comment, rating } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    comment,
    rating: Number(rating),
  };

  const product = await productModel.findById(productId);
  product.reviews.push(review);
  let avg = 0;
  product.reviews.forEach((review) => {
    avg += review.rating;
  });
  product.rating = avg / product.reviews.length;
  await product.save({ validateBeforeSave: true });

  res.status(200).json({ message: "Yorumunuz Kaydedildi" });
};

module.exports = {
  allProducts,
  adminAllProducts,
  detailProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  createReview,
};
