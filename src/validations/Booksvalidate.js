import Joi from "joi";

const bookSchema = Joi.object({
  title: Joi.string().trim().required().max(255).messages({
    "string.base": "Tên sách phải là chuỗi",
    "string.empty": "Tên sách không được để trống",
    "string.max": "Tên sách không được vượt quá {#limit} ký tự",
    "any.required": "Tên sách là bắt buộc",
  }),

  description: Joi.string().trim().allow("").max(1000).messages({
    "string.base": "Mô tả phải là chuỗi",
    "string.max": "Mô tả không được vượt quá {#limit} ký tự",
  }),

  author: Joi.string().trim().required().max(100).messages({
    "string.base": "Tác giả phải là chuỗi",
    "string.empty": "Tác giả không được để trống",
    "string.max": "Tác giả không được vượt quá {#limit} ký tự",
    "any.required": "Tác giả là bắt buộc",
  }),

  publisher: Joi.string().trim().required().max(255).messages({
    "string.base": "Nhà xuất bản phải là chuỗi",
    "string.empty": "Nhà xuất bản không được để trống",
    "string.max": "Nhà xuất bản không được vượt quá {#limit} ký tự",
    "any.required": "Nhà xuất bản là bắt buộc",
  }),

  publishYear: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .required()
    .messages({
      "number.base": "Năm xuất bản phải là số nguyên",
      "number.min": "Năm xuất bản không hợp lệ",
      "number.max": "Năm xuất bản không được lớn hơn năm hiện tại",
      "any.required": "Năm xuất bản là bắt buộc",
    }),

  category: Joi.string().trim().optional().messages({
    "string.base": "Danh mục phải là chuỗi",
  }),

  available: Joi.boolean().optional().messages({
    "boolean.base": "Trạng thái có sẵn phải là true hoặc false",
  }),

  totalCopies: Joi.number().integer().min(0).required().messages({
    "number.base": "Tổng số lượng phải là số nguyên",
    "number.min": "Tổng số lượng phải lớn hơn hoặc bằng 0",
    "any.required": "Tổng số lượng là bắt buộc",
  }),

  borrowedCopies: Joi.number().integer().min(0).optional().messages({
    "number.base": "Số lượng mượn phải là số nguyên",
    "number.min": "Số lượng mượn không được âm",
  }),
});

// Middleware để validate khi tạo hoặc cập nhật sách (tham khảo đoạn dưới trên chat gpt)
const validateBook = (req, res, next) => {
  const { error } = bookSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((err) => err.message);
    return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: messages });
  }
  next();
};

export { bookSchema, validateBook };
