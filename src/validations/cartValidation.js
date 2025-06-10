import Joi from "joi";

export const createCartSchema = Joi.object({
  user: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Kiểm tra ObjectId MongoDB
    .required()
    .messages({
      "string.pattern.base": "ID người dùng không hợp lệ",
      "any.required": "Người dùng là bắt buộc",
    }),

  book: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "ID sách không hợp lệ",
      "any.required": "Sách là bắt buộc",
    }),

  quantity: Joi.number().integer().min(1).max(3).optional().messages({
    "number.base": "Số lượng phải là số",
    "number.min": "Số lượng tối thiểu là 1",
    "number.max": "Số lượng tối đa là 3",
  }),

  requestedReturnDate: Joi.date().greater("now").optional().messages({
    "date.base": "Ngày trả phải là một ngày hợp lệ",
    "date.greater": "Ngày trả phải sau thời điểm hiện tại",
  }),
});

export const deleteOneOrManyCardSchema = Joi.object({
  ids: Joi.array()
    .items(
      Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .message("ID không hợp lệ")
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Phải là một mảng ID",
      "array.min": "Phải có ít nhất một ID để xóa",
      "any.required": "Danh sách ID là bắt buộc",
    }),
});
