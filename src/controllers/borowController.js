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
    const dueDateValidate = new Date(dueDate);
    const today = new Date();
    if (dueDateValidate <= today) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Ngày trả phải sau ngày hiện tại" });
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

export const getUserRecords = async (req, res) => {
  try {
    const userId = req.jwtDecoded.id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token không hợp lệ" });
    }

    const userBorrowReq = await BorrowRecord.find({
      userId: user._id,
    }).populate({
      path: "bookId",
      select: "title category author publisher available ",
      populate: [
        { path: "category", select: "name -_id" },
        { path: "author", select: "name -_id" },
        { path: "publisher", select: "name -_id" },
      ],
    });
    if (!userBorrowReq)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Bạn chưa mượn cuốn sách nào" });

    res.status(StatusCodes.OK).json({ userBorrowReq });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const updateRecordStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatus = ["borrowed", "returned", "overdue"];
    if (!validStatus.includes(status))
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Trạng thái không hợp lệ" });

    const record = await BorrowRecord.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    ).populate("bookId");

    if (!record)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "bản ghi không tồn tại" });

    if (status === "returned" && record.bookId) {
      await Book.findByIdAndUpdate(record.bookId._id, {
        $inc: { available: 1 },
      });
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: "Cập nhật trạng thái thành công", data: { record } });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
