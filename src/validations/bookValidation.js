import Joi from "joi";

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

export const bookSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "Vui lòng cung cấp tên sách",
    "any.required": "Vui lòng cung cấp tên sách",
  }),

  image: Joi.array()
    .items(
      Joi.string().uri().required().messages({
        "string.uri": "Mỗi hình ảnh phải là một URL hợp lệ",
        "any.required": "Vui lòng cung cấp hình ảnh sách",
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Hình ảnh phải là một mảng",
      "array.min": "Ít nhất phải có một hình ảnh",
      "any.required": "Vui lòng cung cấp hình ảnh sách",
    }),

  description: Joi.string().trim().optional(),

  author: Joi.string().custom(objectId).required().messages({
    "any.invalid": "Phải là 1 object ID hợp lệ",
    "any.required": "Vui lòng chọn tác giả",
  }),

  publisher: Joi.string().custom(objectId).required().messages({
    "any.invalid": "Phải là 1 object ID hợp lệ",
    "any.required": "Vui lòng chọn nhà xuất bản",
  }),

  category: Joi.string().custom(objectId).required().messages({
    "any.invalid": "Phải là 1 object ID hợp lệ",
    "any.required": "Vui lòng chọn thể loại",
  }),

  quantity: Joi.number().integer().min(0).default(0),

  available: Joi.number().integer().min(0).default(0),

  publishedYear: Joi.number().integer().min(1000).required().messages({
    "number.base": "Năm xuất bản phải là số",
    "number.min": "Năm xuất bản không hợp lệ",
    "any.required": "Vui lòng cung cấp năm xuất bản",
  }),
});
