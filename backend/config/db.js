const mongoose = require("mongoose"); //! db bağlantısı için kullanılan paket

const db = () => {
  mongoose
    .connect(
      process.env.DB_CONNECTION,

      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("MongoDB bağlantısı başarılı");
    })
    .catch((err) => {
      console.log("MongoDB bağlantısı sırasında hata oluştu", err);
    });
};

module.exports = db; //! dışarıya çıkarttık
