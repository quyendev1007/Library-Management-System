import bcrypt from "bcryptjs";
import { User } from "../models/user";
import { pickUser } from "../utils/formatters";
import { generateToken } from "../providers/jwtProvider";
import { StatusCodes } from "http-status-codes";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Email đã tồn tại",
        message: "Vui lòng sử dụng email khác",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    return res.status(StatusCodes.CREATED).json({
      message: "Đăng ký thành công",
      ...pickUser(user),
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
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
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Email không tồn tại",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Mật khẩu không trùng khớp",
      });
    }

    const userInfo = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = await generateToken(
      userInfo,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
      process.env.ACCESS_TOKEN_LIFE
    );

    const refreshToken = await generateToken(
      userInfo,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
      process.env.ACCESS_TOKEN_LIFE
    );

    return res.status(StatusCodes.OK).json({
      ...pickUser(user),
      refreshToken,
      accessToken,
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
    const currentUser = req.jwtDecoded;
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
