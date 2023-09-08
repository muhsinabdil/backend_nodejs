//! Define the allowed origins
const whitelist = ["http://localhost:3000", "http://example2.com"];

//! Set up CORS options
const corsOptions = (req, callback) => {
  let corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    //! header içinde origin varmı diye bakıyoruz
    corsOptions = { origin: true }; //! origin varsa true dönecek
  } else {
    corsOptions = { origin: false }; //! origin yoksa false dönecek
  }

  callback(null, corsOptions);
};

module.exports = corsOptions;
