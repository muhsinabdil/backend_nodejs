const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const db = require("./config/db.js");
const productRoutes = require("./routes/products_route.js");
const userRoutes = require("./routes/user_route.js");
const cloudinary = require("cloudinary").v2;

dotenv.config();

console.log("Starting");

const HOST = "127.0.0.1";
const PORT = 3000;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const app = express();
app.use(cors());

app.use(bodyParser.json({ limit: "30mb", extended: true }));

app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cookieParser());

app.use("/", productRoutes);
app.use("/", userRoutes);

db();

app.listen(PORT, HOST, () => {
  console.log(`http://${HOST}:${PORT} adresi dinleniyor`);
});
