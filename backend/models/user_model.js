//! model için önce
const mongoose = require("mongoose");
//! Schema içine parameter oluşturuyoruz
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minLength: 6 },
    /*  avatar: {
      public_id: { type: String, required: true },
      url: { type: String, required: true }, //! avatarı iptal ettim
    }, */
    role: { type: String, default: "user", required: true },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);
//!modeli çıkarıyoruz model adı ardından schema
module.exports = mongoose.model("UserModel", userSchema);
