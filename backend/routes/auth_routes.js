const express = require("express");
const authValidation = require("../middlewares/validations/auth_validation_middleware.js"); //! validationları import ettik

//! kullanacağımız fonksiyonları çekiyoruz
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  me,
} = require("../controllers/auth_controller.js");
const {
  authenticationMiddleware,
  tokenCheck,
} = require("../middlewares/auth_middleware.js");

const router = express.Router(); //! router oluşturduk

//! yol ve kontroller alır
router.post("/register", authValidation.register, register); //! rota + validationu ekledik, Controller Ekli
router.post("/login", authValidation.login, login); //! rota + validationu ekledik, Controller Ekli
router.get("/logout", logout); //!sadece çıkış olduğu için post gerekmez
router.post("/forgotPassword", forgotPassword);
router.post("/reset/:token", resetPassword); //! gelen token ile işlem yapılacak
router.get("/me", tokenCheck, me); //! gelen token ile işlem yapılacak

module.exports = router; //! routerları export ettik
