//! model için önce
const { trim } = require("lodash");
const mongoose = require("mongoose");
//! Schema içine parameter oluşturuyoruz
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, minLength: 6, trim: true },
    /*  avatar: {
      public_id: { type: String, required: true },
      url: { type: String, required: true }, //! avatarı iptal ettim
    }, */
    role: { type: String, default: "user", required: true },
    resetPasswordToken: String,
    reset: {
      code: { type: String, default: null }, //! kod oluşturulunca buraya yazılır
      time: { type: String, default: null }, //!ileriye bir zaman oluşturulur örneğin 5dk sonra kodun geçersiz olması için
    },
    resetPasswordExpire: Date,
  },
  { collection: "users", timestamps: true } //! koleksiyon adını verdik ve kayıtlara timestamp ekledik
);
//!modeli dışarıya açıyoruz model adı ardından schema
module.exports = mongoose.model("UserModel", userSchema);
