import { StatusCodes } from "http-status-codes";
import { User } from "../models/user";
import Book from "../models/books";
import BorrowRecord from "../models/borrowRecord";

export const requestBorrow = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.jwtDecoded.id;
    const { dueDate } = req.body;

    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token không hợp lệ" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Sách không tồn tại" });
    }

    if (book.available <= 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Sách này đã hết" });
    }
    const newAvailable = book.available - 1;

    const existingBorrow = await BorrowRecord.findOne({
      userId: user._id,
      bookId: book._id,
      status: "borrowed",
    });

    if (existingBorrow) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Bạn đã mượn sách này và chưa trả",
      });
    }
    const borrowed = await BorrowRecord.create({
      userId: user._id,
      bookId: book._id,
      dueDate,
    });

    await Book.updateOne({ _id: bookId }, { available: newAvailable });

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Mượn sách thành công", borrowed });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getAllRequestBorrow = async (req, res) => {
  try {
    const borrowRecords = await BorrowRecord.find()
      .populate("userId", "name email -_id")
      .populate({
        path: "bookId",
        select: "title category author publisher available -_id",
        populate: [
          { path: "category", select: "name -_id" },
          { path: "author", select: "name -_id" },
          { path: "publisher", select: "name -_id" },
        ],
      });

    return res.status(StatusCodes.OK).json({ borrowRecords });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
