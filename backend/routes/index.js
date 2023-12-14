const router = require("express").Router();

//! rota tanımlamaları olacak
const homeRoutes = require("./home_routes");
const authRoutes = require("./auth_routes");
//! temiz kod için yapıyoruz
//! birden çok servis oluşturacağımız için tek bir yerden yönebileceğiz
router.use(homeRoutes, authRoutes);

module.exports = router;
