export const validateRequest = (schema, target = "body") => {
  return (req, res, next) => {
    console.log(req[target]);

    const { error, value } = schema.validate(req[target], {
      abortEarly: true,
      stripUnknown: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        details: error.details.map((err) => err.message),
      });
    }
    req[target] = value;
    next();
  };
};
