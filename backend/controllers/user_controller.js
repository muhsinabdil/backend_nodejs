const userModel = require("../models/user_model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); //!node.js içinde var kurmaya gerek yok
const nodemailer = require("nodemailer");
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
  const { name, email, password } = req.body;

  //! gelen mail ila sorgu yapıyoruz
  const user = await userModel.findOne({ email });
  if (user) {
    //! aynı mail daha önce kullanılmış ise bunu reddetmek gerek
    return res.status(400).json({ message: "Bu kullanıcı zaten var" });
  }

  //! şifreyi hashledik
  const passwordHash = await bcrypt.hash(password, 10);
  if (password.length < 6) {
    //! uyarı verdirdik
    return res.status(400).json({ message: "Şifre en az 6 karakterli olmalı" });
  }

  //! kullanıcı oluşturduk burada hashli passwordu verdik
  const newUser = await userModel.create({
    name,
    email,
    password: passwordHash,
    //! avatarı yükledikten sonra görselin değerlerini alıyoruz
    //  avatar: { public_id: avatar.public_id, url: avatar.secure_url },
  });
  //!Token oluşturuyoruz
  const token = await jwt.sign({ id: newUser._id }, "SECRETTOKEN", {
    expiresIn: "1h",
  });

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000), //!sanırım geçerlilik süresi ben 50 gün yaptım
  };

  res
    .status(201)
    .cookie("token", token, cookieOptions) //! cookilere tokenı "token" olarak kaydettik
    .json({ newUser, token });
};
const login = async (req, res) => {
  //!kullanıcıdan alınacak değerler
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    //! bulunamadı ise
    return res.status(400).json({ message: "Kullanıcı bulunamadı" });
  }

  const comparePasswords = await bcrypt.compare(password, user.password);
  if (!comparePasswords) {
    //! Şifre yanlış ise
    return res.status(400).json({ message: "Kullanıcı veya şifre yanlış" });
  }

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
        user: process.env.email_address,
        pass: process.env.email_password,
      },
      secure: true,
    });

    const mailData = {
      from: process.env.email_address,
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
