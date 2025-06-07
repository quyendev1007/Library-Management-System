import bcrypt from "bcryptjs";
import { User } from "../models/user";
import { pickUser } from "../utils/formatters";
import { generateToken, verifyToken } from "../providers/jwtProvider";
import { StatusCodes } from "http-status-codes";
import ms from "ms";

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
      process.env.REFRESH_TOKEN_SECRET_SIGNATURE,
      process.env.REFRESH_TOKEN_LIFE
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: ms("14 days"),
      sameSite: "none",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: ms("14 days"),
      sameSite: "none",
    });

    return res.status(StatusCodes.OK).json({
      user: pickUser(user),
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

export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(StatusCodes.OK).json({
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Lỗi khi đăng xuất",
      message: error.message,
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const clientRefreshToken = req.cookies?.refreshToken;

    if (!clientRefreshToken) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Refresh token het han hoac khong ton tai",
      });
    }

    const isValid = await verifyToken(
      clientRefreshToken,
      process.env.REFRESH_TOKEN_SECRET_SIGNATURE
    );

    if (!isValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Refresh token khong hop le",
      });
    }

    const userInfo = isValid;

    const newAccessToken = await generateToken(
      userInfo,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
      process.env.ACCESS_TOKEN_LIFE
    );

    return res.status(StatusCodes.OK).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Lỗi khi làm mới token",
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
