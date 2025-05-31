import { StatusCodes } from "http-status-codes";

//nhận vào 1 allowedRoles là 1 mảng những roles đc phép truy cập vào API
export const isValidPermission = (allowedRoles) => async (req, res, next) => {
  try {
    const userRole = req.jwtDecoded?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "You are not allowed to access this API" });
    }

    next();
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Oops! Something went wrong!",
      message: error.message,
    });
  }
};
