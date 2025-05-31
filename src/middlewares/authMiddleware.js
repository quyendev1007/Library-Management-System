import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, "123456");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token không hợp lệ" });
  }
};
