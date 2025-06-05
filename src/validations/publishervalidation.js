import Joi from "joi";
export const publisherSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Vui lòng cung cấp tên nhà xuất bản",
    "any.required": "Tên nhà xuất bản là bắt buộc",
  }),

  address: Joi.string().trim().allow("", null).messages({
    "string.base": "Địa chỉ phải là chuỗi ký tự",
  }),
  
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .allow("", null)
    .messages({
      "string.pattern.base": "Số điện thoại không hợp lệ",
      "string.base": "Số điện thoại phải là chuỗi",
    }),

  email: Joi.string().email().allow("", null).messages({
    "string.email": "Email không hợp lệ",
    "string.base": "Email phải là chuỗi",
  }),

  website: Joi.string().uri().allow("", null).messages({
    "string.uri": "Website phải là URL hợp lệ",
    "string.base": "Website phải là chuỗi",
  }),
});
