import { StatusCodes } from "http-status-codes";
import Author from "../models/author.js";

const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm tác giả" });

    res.status(StatusCodes.OK).json(author);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const createAuthor = async (req, res) => {
  try {
    const newAuthor = await new Author(req.body).save();

    if (!newAuthor)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Có lỗi sảy ra, vui lòng thử lại sau ít phút." });

    res.status(StatusCodes.CREATED).json(newAuthor);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAuthor)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Tác giả không tồn tại" });

    res.status(StatusCodes.OK).json(updatedAuthor);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const deleted = await Author.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Tác giả không tồn tại" });

    res.status(StatusCodes.OK).json({ message: "Xóa thành công" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const authorController = {
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
