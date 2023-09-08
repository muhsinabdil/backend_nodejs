//!yetkilendirmeleri yönete bilmek için yazdık. admin işlemleri ekleyeceğiz

const userModel = require("../models/user_model.js");
const jwt = require("jsonwebtoken");
const APIError = require("../utils/errors.js");

const authenticationMiddleware = async (req, res, next) => {
  if (req.headers.authorization === undefined) {
    return res.status(400).json({ message: "Giriş yapınız" });
  }
  //! TODO: burası hatalı  cookiden veri gelmiyor videoda o yüzden doğrudan header içinde token gönderecez
  //const { token } = req.cookies;
  const token = req.headers.authorization.split(" ")[1]; //bearer token içinden sadece token alıyoruz

  if (!token) {
    //!token yoksa hata dönecek
    return res.status(400).json({ message: "Giriş yapınız" });
  }
  //console.log(req);
  const decodedData = jwt.verify(token, "SECRETTOKEN", {
    ignoreExpiration: true,
  }); //! user controller içinde yazdık bu terimi SECRETTOKEN

  if (!decodedData) {
    //!token yoksa hata dönecek
    return res.status(400).json({ message: "Token geçersiz" });
  }
  req.user = await userModel.findById(decodedData.id); //! decodedData üzerinden gelen id controller içinde ekleniyor

  next(); //! middleware olduğu için
};
//fonksiyon ile üreteceğiz
const createToken = async (user, res) => {
  //! paremetredeki user loginden gönderilen user

  const payload = {
    //! jwt sitesinde bu şekilde iki tane bilgi girmeyi tavsiye ediyor
    sub: user._id,
    name: user.name,
  };
  const token = await jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
    algorithm: "HS512", //! şifreleme algoritması
    expiresIn: process.env.JWT_EXPIRES_IN, //! sona erme tarihi token süresini dolduracağız yönlendirmeyle logine atmak gerek
  });
  return res.status(201).json({
    success: true,
    token: token,
    message: "Giriş başarılı",
  });
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

const tokenCheck = async (req, res, next) => {
  const headerToken =
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer "); //! önce authorization varmı dedik sonra token içinde bearer ifadesi varmı diyede baktık

  //! token yoksa hata dönecek
  if (!headerToken) {
    throw new APIError("Geçersiz Oturum oturum açın", 401);
  }

  const token = req.headers.authorization.split(" ")[1]; //! authorization içindeki bearer ifadesini sildik sadece token değerini aldık

  //!tokenı çözümleyeceğiz
  await jwt.verify(
    token,
    process.env.JWT_TOKEN_SECRET,
    async (err, decodedData) => {
      //!çözümleyemediyse
      if (err) {
        throw new APIError("Geçersiz Token", 401);
      }
      //!Çözümlediyse gelen bilgiyle user bulacağız
      const userInfo = await userModel
        .findById(decodedData.sub) //! token üzerinden gelen id sub  içinde, createToken metodunda ekleniyor
        .select("_id name lastname email role"); //! decodedData üzerinden gelen id controller içinde ekleniyor

      if (!userInfo) {
        throw new APIError("Kullanıcı bulunamadı", 404);
      }

      req.user = userInfo;
      next(); //!  işlemin devam etmesini sağladık
    }
  );
};

module.exports = {
  authenticationMiddleware,
  createToken,
  roleChecked,
  tokenCheck,
};
