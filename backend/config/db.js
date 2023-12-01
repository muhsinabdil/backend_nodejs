const mongoose = require("mongoose");

const db = () => {
  mongoose
    .connect(
      "mongodb+srv://muhsinabdill:deneme123l@clusteregitim.z3tubj0.mongodb.net/",

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
