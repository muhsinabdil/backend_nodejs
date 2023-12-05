const userModel = require("../models/user_model.js");
const bcrypt = require("bcryptjs");
const jwt = require("bcryptjs");

//! işlemleri yazıyoruz
//!
const register = async (req, res) => {};
const login = async (req, res) => {};
const logout = async (req, res) => {};
const forgotPassword = async (req, res) => {};
const resetPassword = async (req, res) => {};

//! bunları dışarı çıkarıyoruz
module.exports = { register, login, logout, forgotPassword, resetPassword };
