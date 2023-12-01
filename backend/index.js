const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const db = require("./config/db.js");
const productRoutes = require("./routes/products_route.js");
const cloudinary = require("cloudinary").v2;

dotenv.config();

console.log("Starting");

const HOST = "127.0.0.1";
const PORT = 3000;

cloudinary.config({
  cloud_name: "dbpcncm9w",
  api_key: "238122853544461",
  api_secret: "6gzp79xd9Mw66p9L7o1bJHmdL4A",
});

const app = express();
app.use(cors());

app.use(bodyParser.json({ limit: "30mb", extended: true }));

app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cookieParser());

app.use("/products", productRoutes);

app.get("/products", (req, res) => {
  res.status(200).json({ message: "Rota belirlendi" });
});

console.log("burada işlem");
db();

app.listen(PORT, HOST, () => {
  console.log(`http://${HOST}:${PORT} adresi dinleniyor`);
});
