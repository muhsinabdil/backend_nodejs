//!yetkilendirmeleri yönete bilmek için yazdık. admin işlemleri ekleyeceğiz

const userModel = require("../models/user_model.js");
const jwt = require("jsonwebtoken");

const authenticationMiddleware = async (req, res, next) => {
  if (req.headers.authorization === undefined) {
    return res.status(400).json({ message: "Giriş yapınız" });
  }
  //! TODO: burası hatalı  cookiden veri gelmiyor videoda o yüzden doğrudan header içinde token gönderecez
  //const { token } = req.cookies;
  const token = req.headers.authorization.split(" ")[1]; //bearer token içinden sadece token alıyoruz

  console.log("token=" + token);
  if (!token) {
    //!token yoksa hata dönecek
    return res.status(400).json({ message: "Giriş yapınız" });
  }
  //console.log(req);
  const decodedData = jwt.verify(token, "SECRETTOKEN", {
    ignoreExpiration: true,
  }); //! user controller içinde yazdık bu terimi SECRETTOKEN
  console.log("decode=" + decodedData);
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
