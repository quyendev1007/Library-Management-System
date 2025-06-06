import { StatusCodes } from "http-status-codes";
import { User } from "../models/user";
import { pickUser } from "../utils/formatters";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server something went wrong!", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy người dùng!" });
    }
    res.status(StatusCodes.OK).json(pickUser(user));
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server something went wrong!", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy người dùng!" });
    }
    res.status(StatusCodes.OK).json(pickUser(updatedUser));
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Cập nhật thất bại!", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy người dùng!" });
    }
    res.status(StatusCodes.OK).json({ message: "Xóa người dùng thành công!" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server something went wrong!", error: error.message });
  }
};

export const userController = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
