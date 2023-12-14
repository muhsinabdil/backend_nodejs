const APIError = require("../utils/errors");

const errorHandlerMiddleware = (err, req, res, next) => {
  // Handle the error here
  //! instanceof bir objanın belirli bir sınıfa ait olup olmadığını kontrol eder

  if (err instanceof APIError) {
    //! err APIError sınıfından ise
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
    });
  }

  //! err APIError sınıfından değilse
  return res.status(500).json({
    success: false,
    message: "Hata oluştu sistem yöneticisi ile görüşünüz",
  });
};

module.exports = errorHandlerMiddleware;
