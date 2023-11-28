const express = require("express");
//! kullanacağımız fonksiyonları çekiyoruz
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  userDetail,
} = require("../controllers/user_controller.js");
const {
  authenticationMiddleware,
} = require("../middlewares/auth_middleware.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout); //!sadece çıkış olduğu için post gerekmez
router.post("/forgotPassword", forgotPassword);
router.post("/reset/:token", resetPassword); //! gelen token ile işlem yapılacak
router.get("/me", authenticationMiddleware, userDetail); //! gelen token ile işlem yapılacak

module.exports = router; //! routerları export ettik
