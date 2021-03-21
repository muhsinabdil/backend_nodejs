const joi = require("joi");
const APIError = require("../../utils/errors.js");

class authValidation {
  constructor() {}

  //!statik yaptık newlemeyeceğiz
  static register = async (req, res, next) => {
    try {
      await joi
        .object({
          //! alanları kontrol ediyoruz
          name: joi.string().required().trim().min(3).max(100).messages({
            "string.base": "Ad alanı metin olmalıdır",
            "string.empty": "Ad alanı boş olamaz",
            "string.min": "Ad alanı en az 3 karakter olmalıdır",
            "string.max": "Ad alanı en fazla 100 karakter olmalıdır",
            "string.required": "Ad alanı zorunludur",
          }),
          lastname: joi.string().required().trim().min(3).max(100).messages({
            "string.base": "Soyad alanı metin olmalıdır",
            "string.empty": "Soyad alanı boş olamaz",
            "string.min": "Soyad alanı en az 3 karakter olmalıdır",
            "string.max": "Soyad alanı en fazla 100 karakter olmalıdır",
            "string.required": "Soyad alanı zorunludur",
          }),
          email: joi
            .string()
            .required()
            .email()
            .trim()
            .min(3)
            .max(100)
            .messages({
              "string.base": "Email alanı metin olmalıdır",
              "string.empty": "Email alanı boş olamaz",
              "string.min": "Email alanı en az 3 karakter olmalıdır",
              "string.max": "Email alanı en fazla 100 karakter olmalıdır",
              "string.required": "Email alanı zorunludur",
              "string.email": "Email adresi geçersiz",
            }),
          password: joi.string().required().trim().min(3).max(36).messages({
            "string.base": "Şifre alanı metin olmalıdır",
            "string.empty": "Şifre alanı boş olamaz",
            "string.min": "Şifre alanı en az 6 karakter olmalıdır",
            "string.max": "Şifre alanı en fazla 36 karakter olmalıdır",
            "string.required": "Şifre alanı zorunludur",
          }),
         role: joi.string(),
        })
        .validateAsync(req.body);
    } catch (error) {
      if (error.details && error?.details[0].message) {
        throw new APIError(error.details[0].message, 400);
      } else {
        throw new APIError("Kontrol ediniz", 400);
      }
    }
    next(); //! ara yazılım olduğu için devam etmesi gerektiği belirtiliyor
  };

  static login = async (req, res, next) => {
    try {
      await joi
        .object({
          //! alanları kontrol ediyoruz

          email: joi
            .string()
            .required()
            .email()
            .trim()
            .min(3)
            .max(100)
            .messages({
              "string.base": "Email alanı metin olmalıdır",
              "string.empty": "Email alanı boş olamaz",
              "string.min": "Email alanı en az 3 karakter olmalıdır",
              "string.max": "Email alanı en fazla 100 karakter olmalıdır",
              "string.required": "Email alanı zorunludur",
              "string.email": "Email adresi geçersiz",
            }),
          password: joi.string().required().trim().min(3).max(36).messages({
            "string.base": "Şifre alanı metin olmalıdır",
            "string.empty": "Şifre alanı boş olamaz",
            "string.min": "Şifre alanı en az 6 karakter olmalıdır",
            "string.max": "Şifre alanı en fazla 36 karakter olmalıdır",
            "string.required": "Şifre alanı zorunludur",
          }),
        })
        .validateAsync(req.body);
    } catch (error) {
      if (error.details && error?.details[0].message) {
        throw new APIError(error.details[0].message, 400);
      } else {
        throw new APIError("Kontrol ediniz", 400);
      }
    }
    next(); //! ara yazılım olduğu için devam etmesi gerektiği belirtiliyor
  };
}

module.exports = authValidation;
