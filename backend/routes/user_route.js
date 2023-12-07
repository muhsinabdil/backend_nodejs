const express = require("express");
//! kullanacağımız fonksiyonları çekiyoruz
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/user_controller.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout); //!sadece çıkış olduğu için post gerekmez
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);

module.exports = router; //! routerları export ettik
