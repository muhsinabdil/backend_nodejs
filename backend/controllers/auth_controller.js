const userModel = require("../models/user_model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); //!node.js içinde var kurmaya gerek yok
const nodemailer = require("nodemailer");
const APIError = require("../utils/errors.js");
const Response = require("../utils/response.js");
const { createToken } = require("../middlewares/auth_middleware.js");
//! işlemleri yazıyoruz
//!istekten gelen değerleri body içinden buluyoruz
//! auth işlemleri
const register = async (req, res) => {
  /*  const avatar = cloudinary.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 130,
    crop: "scale",
  }); */
  //!kullanıcıdan alınacak değerler
  const { name, lastname, email, password } = req.body;

  //! gelen mail ila sorgu yapıyoruz
  const userCheck = await userModel.findOne({ email });
  if (userCheck) {
    //! aynı mail daha önce kullanılmış ise bunu reddetmek gerek
    // return res.status(400).json({ message: "Bu kullanıcı zaten var" });
    throw new APIError("Bu kullanıcı zaten var", 401); //! daha önce return kullanıyorduk artık error middleware ile yapıyoruz
  }

  if (password.length < 6) {
    //! uyarı verdirdik
    return res.status(400).json({ message: "Şifre en az 6 karakterli olmalı" });
  }
  //! şifreyi hashledik
  const passwordHash = await bcrypt.hash(password, 10); //! 10 tur sayısı 10 turda hashlenecek

  //! kullanıcı oluşturduk burada hashli passwordu verdik
  const newUser = await userModel
    .create({
      name,
      lastname,
      email,
      password: passwordHash,
      role: "user", //! standart kullanıcı
      //! avatarı yükledikten sonra görselin değerlerini alıyoruz
      //  avatar: { public_id: avatar.public_id, url: avatar.secure_url },
    })
    .then(async (data) => {
      //!Token oluşturuyoruz
      const token = await jwt.sign({ id: data.id }, "SECRETTOKEN", {
        expiresIn: "30d", //! 30gün
      });

      const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiration
      };

      return new Response(data, "Kayıt başarılı").created(res);
    })
    .catch(() => {
      throw new APIError("Kullanıcı oluşturulamadı", 401);
      // return res.status(400).json({ message: "Kullanıcı oluşturulamadı" }); //! iptal
    }); //! promise yapısı ile başarılı olup olmadığını görelim
};

const login = async (req, res) => {
  //!kullanıcıdan alınacak değerler
  const { email, password } = req.body;

  //! user ile userModel yeri aynı isim olsa hata alırdık
  const user = await userModel.findOne({ email: email }); //! tek email yazsakta olur veya req.body.email de olur

  if (!user) {
    //! bulunamadı ise
    throw new APIError("Email veya şifre yanlış", 401);
    //return res.status(400).json({ message: "Kullanıcı bulunamadı" });
  }
  //! çözümleme yapıyoruz
  //! bcrypt ile şifreleri karşılaştırıyoruz
  const comparePasswords = await bcrypt.compare(password, user.password);
  if (!comparePasswords) {
    //! Şifre yanlış ise
    throw new APIError("Email veya şifre yanlış", 401);

    //! throw ile değiştirdik
    //return res.status(401).json({ message: "Email veya şifre yanlış" });
  }
  /* //!iptal ettik middleware içinde yapıyoruz  
  //!Token oluşturuyoruz
  const token = await jwt.sign({ id: user._id }, "SECRETTOKEN", {
    expiresIn: "120m",
  });

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 50000 * 24 * 60 * 60 * 1000), //!sanırım geçerlilik süresi ben 50 gün yaptım
  };

  res
    .status(201)
    .cookie("token", token, cookieOptions) //! cookilere tokenı "token" olarak kaydettik
    .json({ token }); //! userda vardı çıkarttık {user, token } 
    */
};
const logout = async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now()), //!geçerlilik süresini şuan diye belirledim
  };
  res
    .status(200)
    .cookie("token", null, cookieOptions)
    .json({ message: "Çıkış işlemi başarılı" });
};
const forgotPassword = async (req, res) => {
  //! kullanıcı tarafından gelen mail ile user var mı diye baktık
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ message: "Kullanıcı bulunamadı" });
  }

  //! crypto üzerinden
  const resetToken = crypto.randomBytes(20).toString("hex");

  //!oluşturulan reset token hashlenip resetpasswordtoken oluyor
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 1 * 24 * 60 * 60 * 1000; //! 1 gün ayarladık

  await user.save({ validateBeforeSave: false });

  //! reset password url oluşturuyoruz
  const passwordUrl = `${req.protocol}://${req.get(
    "host"
  )}/reset/${resetToken}`;
  //! node mailer ile gönderilecek mesaj
  const message = `Linke tıklayarak şifrenizi sıfırlayabilirsiniz.  ${passwordUrl}`;

  try {
    //! hata yoksa node mailer devreye girer
    const transporter = nodemailler.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: true,
    });

    const mailData = {
      from: process.env.EMAIL_ADDRESS,
      to: req.body.email,
      subject: "Şifre Sıfırlama",
      text: message,
    };
    await transporter.sendMail(mailData);

    return res.status(200).json({ message: "Mailinizi kontrol ediniz" });
  } catch (error) {
    user.resetPasswordToken = undefined; //! hata olursa boşaltıyoruz
    user.resetPasswordExpire = undefined; //! hata olursa boşaltıyoruz
    await user.save({ validateBeforeSave: false });
    return res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  //!gelen bağlantıdan tıkladıktan sonra
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  //!hangi kullanıcının şifresi değişecek onu bulacağız
  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    //! user bulunamaz ise
    return res.status(500).json({ message: "Geçersiz istek" });
  }

  //! user objesinde değişiklik yapıyoruz
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save(); //! kaydettik
  //!Token oluşturuyoruz
  const token = await jwt.sign({ id: user._id }, "SECRETTOKEN", {
    expiresIn: 120,
  });
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000), //!sanırım geçerlilik süresi ben 50 gün yaptım
  };

  res
    .status(201)
    .cookie("token", token, cookieOptions) //! cookilere tokenı "token" olarak kaydettik
    .json({ user, token });
};

const userDetail = async (req, res, next) => {
  //!istediğimiz userı buluyoruz
  console.log(req.email);
  const user = await userModel.findOne(req.email);
  res.status(200).json({ user });
};

//! bunları dışarı çıkarıyoruz,
module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  userDetail,
};
