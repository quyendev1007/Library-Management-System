import { StatusCodes } from "http-status-codes";
import { User } from "../models/user";
import { pickUser } from "../utils/formatters";

const getAllUsers = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 5,
      sortBy = "name",
      order = "desc",
    } = req.query;
    const skip = (page - 1) * limit;

    const sortOrder = order === "desc" ? -1 : 1;
    const sortOptions = {};
    if (sortBy === "name" || sortBy === "createdAt") {
      sortOptions[sortBy] = sortOrder;
    }

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [users, totalDocuments] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort(sortOptions)
        .limit(limit)
        .skip(skip),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalDocuments / limit);

    if (page < 1 || page > totalPages) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Khong co user nao" });
    }

    res
      .status(StatusCodes.OK)
      .json({ users, currentPage: page, totalPages, totalDocuments });
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
