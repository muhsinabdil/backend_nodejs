require("express-async-errors"); //! hataları yakalamak için ve backendin çökmemesi için
const express = require("express");
require("dotenv").config(); //! bu olmaz ise .ENV içinden port vs erişemiyor
const cors = require("cors"); //! gelen isteklerin urllerini kontrol edip kabul eder veya ret eder
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const db = require("./config/db.js");
//! temiz kod ile tek bir router tanımlıyoruz olmasaydı her routerı tek tek tanımlardık
const router = require("./routes"); //! index.js dosyasını görür
const errorHandlerMiddleware = require("./middlewares/error_handler_middleware.js");

const mongoSanitizer = require("express-mongo-sanitize"); //! injection saldırılarını önlemek için
const corsOptions = require("./helper/cors_options.js"); //! cors ayarları için
//const homeRoutes = require("./routes/home_route.js");
//const productRoutes = require("./routes/products_route.js");
//const userRoutes = require("./routes/auth_route.js");
//! routerı ayırdığımız için yukarıdakileri yorum satırına aldık

const cloudinary = require("cloudinary").v2;
//const HOST = "46.101.99.199";
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;

console.log("Başlatılıyor");
db("deneme");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const app = express();
app.use(cors(corsOptions)); //! gelen isteklerin urllerini kontrol edip kabul eder veya ret eder

app.use(bodyParser.json({ limit: "30mb", extended: true }));

app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use(cookieParser());

//! Injection saldırılarını önlemek için
app.use(
  mongoSanitizer({
    replaceWith: "_",
  })
); //!mongoDB injection saldırılarına karşı koruma

//! daha önce route ları tek tek tanımlayıp burada çağırıyorduk şimdi sadece router çağırıyoruz
//app.use("/", router);
//app.use("/", router);
app.use("/", router);

app.use(errorHandlerMiddleware);
app.listen(port, host, () => {
  console.log(`http://${host}:${port} adresi dinleniyor`);
});
