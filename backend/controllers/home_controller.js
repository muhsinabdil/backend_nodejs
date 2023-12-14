// Home sayfası için gerekli controller fonksiyonunu oluşturun
const welcomeMessage = (req, res) => {
  res.status(200).json({
    message:
      "Hoş Geldiniz! Sınavda başarılı olmanızı dilerim. Bir probleminiz olursa ben buradayım",
  });
};

// Controller fonksiyonunu dışa aktarın
module.exports = welcomeMessage;
