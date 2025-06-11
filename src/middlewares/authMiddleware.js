import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../providers/jwtProvider";

export const isAuthorized = async (req, res, next) => {
  const clientAccessToken = req.headers.authorization?.split(" ")[1];

  if (!clientAccessToken)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access Denied" });

  try {
    const jwtDecoded = await verifyToken(
      clientAccessToken,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE
    );

    req.jwtDecoded = jwtDecoded;
    next();
  } catch (err) {
    if (err?.message?.includes("jwt expired")) {
      return res
        .status(StatusCodes.GONE)
        .json({ message: "Need to refresh token" });
    }

    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Token không hợp lệ" });
  }
};
