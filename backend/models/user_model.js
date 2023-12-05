//! model için önce
const mongoose = require("mongoose");
//! Schema içine parameter oluşturuyoruz
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mail: { type: String, required: true },
    password: { type: String, required: true, minLength: 6 },
    avatar: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    role: { type: String, default: "user", required: true },
  },
  { timestamps: true }
);
//!modeli çıkarıyoruz model adı ardından schema
module.exports = mongoose.model("UserModel", userSchema);
