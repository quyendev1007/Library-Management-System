import { StatusCodes } from "http-status-codes";
import { WHITELIST_DOMAINS } from "../utils/constants";

export const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép nếu: origin nằm trong whitelist hoặc không có origin (Postman, curl)
    if (!origin || WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error(
        StatusCodes.FORBIDDEN,
        `${origin} not allowed by our CORS Policy.`
      )
    );
  },

  optionsSuccessStatus: 200,

  credentials: true,
};
