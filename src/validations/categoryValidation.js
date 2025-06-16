import Joi from "joi";

// Schema cho Category
export const categorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
});
