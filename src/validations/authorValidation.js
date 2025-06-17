import Joi from "joi";

// Schema cho Author
export const authorSchema = Joi.object({
  name: Joi.string().required(),
  bio: Joi.string().required(),
  dateOfBirth: Joi.date(),
});
