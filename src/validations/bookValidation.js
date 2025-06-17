import Joi from "joi";

export const bookSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "Vui lòng cung cấp tên sách",
    "any.required": "Vui lòng cung cấp tên sách",
  }),

  image: Joi.string().uri().required().messages({
    "string.uri": "Mỗi hình ảnh phải là một URL hợp lệ",
    "any.required": "Vui lòng cung cấp hình ảnh sách",
  }),

  description: Joi.string().trim().optional(),

  author: Joi.string().required(),

  publisher: Joi.string().required(),

  category: Joi.string().required(),

  quantity: Joi.number().integer().min(0).default(0),

  available: Joi.number().integer().min(0).default(0),

  publishedYear: Joi.number().integer().min(1000).required(),
});
