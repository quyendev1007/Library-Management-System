import bcrypt from "bcryptjs";
import { User } from "../models/user";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    user.password = undefined;
    return res.status(201).json({
      message: "Đăng ký thành công",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Lỗi khi đăng ký",
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        message: "Email không tồn tại",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({
        message: "Mật khẩu không trùng khớp",
      });
    }
    const token = jwt.sign({ id: user._id }, "123456", { expiresIn: "1h" });
    return res.status(200).json({
      message: "Đăng nhập thành công",
      token,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Lỗi khi đăng nhập",
      message: error.message,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const currentUser = req.user;
    return res.status(201).json({
      message: "Thông tin người dùng",
      data: currentUser,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Lỗi khi lấy thông tin người dùng",
      message: error.message,
    });
  }
};
