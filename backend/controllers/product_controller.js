const productModel = require("../models/product_model.js");
const ProductFilter = require("../utils/product_filter.js");

const { publicDecrypt } = require("crypto");

const allProducts = async (req, res) => {
  console.log("=====>" + req.body.name); // TODO: kaldır
  //! filter pagination tarafına gidecek sayfada gelecek ürün sayısı
  const resultPerPage = 10;
  //! product filter => tüm productlar yerine filtrelenmişleri alır
  const productFilter = new ProductFilter(productModel.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await productFilter.query;
  res.status(200).json({ products }); //! filtre işlemlerinden sonra client tarafına gönderecek
};

const adminAllProducts = async (req, res) => {
  //! tüm ürünleri görmek için
  const products = await productModel.find();

  res.status(200).json({ products });
};

const detailProduct = async (req, res) => {
  const product = await productModel.findById(req.params.id);
  res.status(200).json({ product });
};

const createProduct = async (req, res, next) => {
  let images = [];

  //! images kontrol ediliyor
  if (typeof req.body.images === "string") {
    //!string ise images içine push ediyoruz
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  let allImage = [];

  for (let i = 0; i < images.length; i++) {
    //! görselleri yükleyeceğiz
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "products", //! folder olarak yüklenecek yeri  verdik
    });
    allImage.push({ public_id: result.public_id, url: result.secure_url }); //! yüklendikten sonra dönen değişkenleri alıyoruz
  }
  req.body.images = allImage; //! yapılan import işlemlerinden sonra All images aktardık
  req.body.user = req.user.id; //! id verdik

  const product = await productModel.create(req.body);
  res.status(201).json({ product });
};

const deleteProduct = async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  //!resimleride siliyoruz
  for (let i = 0; i < product.images.length; i++) {
    const result = await cloudinary.uploader.destroy(
      product.images[i].public_id
    );
  }

  //! sonrasında ürünü siliyoruz
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
    //! dışardan görsel geliyorsa resimleride değiştiriyoruz o yüzden eskileri siliyoruz
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
  //! değerlendirme işlemi için
  //!gelen parametreler neler onları belirliyoruz
  const { productId, comment, rating } = req.body;

  //! nesne  oluşturduk map gibi
  const review = {
    user: req.user._id,
    name: req.user.name,
    comment,
    rating: Number(rating), //!sayıya çevirdik
  };

  //! yorum yapılan ürünü bulduruyoruz
  const product = await productModel.findById(productId);

  //!ürünün içindeki yorumlara push ederek ekliyoruz
  product.reviews.push(review);
  let avg = 0;

  //! tek tek gezerek ratingleri toplayalım
  product.reviews.forEach((review) => {
    avg += review.rating;
  });

  //! ratingi yorum sayısına böldük
  product.rating = avg / product.reviews.length;

  //! kaydetmek için
  await product.save({ validateBeforeSave: true });
  //! sonuç dönüyoruz
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
