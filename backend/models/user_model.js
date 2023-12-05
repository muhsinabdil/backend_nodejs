//! model için önce
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: "string", required: true },
  mail: { type: "string", required: true },
  password: { type: "string", required: true, minHeight: 6 },
  avatar: { public_id: { type: "string", required: true } },
});

module.exports = mongoose.model("UserModel", userSchema);
