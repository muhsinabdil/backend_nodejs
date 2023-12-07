//!yetkilendirmeleri yönete bilmek için yazdık. admin işlemleri ekleyeceğiz

const userModel = require("../models/user_model.js");
const jwt = require("jsonwebtoken");

const authenticationMiddleware = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    //!token yoksa hata dönecek
    return res.status(400).json({ message: "Giriş yapınız" });
  }

  const decodedData = jwt.verify(token, "SECRETTOKEN"); //! user controller içinde yazdık bu terimi SECRETTOKEN

  if (!decodedData) {
    //!token yoksa hata dönecek
    return res.status(400).json({ message: "Token geçersiz" });
  }
  req.user = await userModel.findById(decodedData.id); //! decodedData üzerinden gelen id controller içinde ekleniyor

  next(); //! middleware olduğu için
};

//! kişinin rolünü kontrol edecek
const roleChecked = (...roles) => {
  //! middleware yazdığımız için next ile dolduruyoruz
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "İzniniz yok" });
    }
    next();
  };
};

module.exports = { authenticationMiddleware, roleChecked };
