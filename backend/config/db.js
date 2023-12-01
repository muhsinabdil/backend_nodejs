const mongoose = require("mongoose");

const db = () => {
  mongoose
    .connect(
      process.env.db_connect,

      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("mongodb bağlantı kuruldu");
    })
    .catch((err) => {
      console.log(err);
      console.log("mongodb bağlantı hatası");
    });
};

module.exports = db; //! dışarıya çıkarttık
