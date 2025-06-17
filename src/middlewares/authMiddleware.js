import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../providers/jwtProvider";

export const isAuthorized = async (req, res, next) => {
  try {
    const clientAccessToken = req.headers.authorization?.split(" ")[1];

    if (!clientAccessToken)
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Access Denied" });

    const jwtDecoded = await verifyToken(
      clientAccessToken,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE
    );

    console.log(jwtDecoded);

    req.jwtDecoded = jwtDecoded;
    next();
  } catch (err) {
    console.log("err", err);
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
