const router = require("express").Router();
const upload = require("../middlewares/lib/upload");
const multer = require("multer"); //! dosya yükleme paketi
const Response = require("../utils/response");

//! rota tanımlamaları olacak
const homeRoutes = require("./home_routes");
const authRoutes = require("./auth_routes");
const categoryRoutes = require("./category_routes");

//! temiz kod için yapıyoruz
//! birden çok servis oluşturacağımız için tek bir yerden yönebileceğiz
router.use(homeRoutes, authRoutes, categoryRoutes);

//! dosya yükleme genel bir işlem olduğu için uploadı buraya verdik
router.post("/upload", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      //! multer hatası ise
      throw new APIError("Multer Yükleme Hatası Oluştu", err);
    } else if (err) {
      throw new APIError("Dosya Yükelenirken Hata Oluştu", err);
    } else {
      console.log("Yüklendi");
      return new Response(req.savedImages, "Yükleme Başarılı").success(res);
    }
  });
});

module.exports = router;
