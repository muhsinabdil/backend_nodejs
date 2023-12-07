const mongoose = require("mongoose");

const db = () => {
  mongoose
    .connect(
<<<<<<< HEAD
      process.env.db_connection,
=======
      "mongodb+srv://muhsinabdil:deneme123@clusteregitim.z3tubj0.mongodb.net/",
>>>>>>> 7ed2936cd95e8db3835ec98848a897673cc3efd3

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
