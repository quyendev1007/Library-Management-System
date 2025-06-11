import { StatusCodes } from "http-status-codes";
import { User } from "../models/user";
import Book from "../models/books";
import BorrowRecord from "../models/borrowRecord";
import { Cart } from "../models/cart";

export const requestBorrow = async (req, res) => {
  try {
    // sử dụng transaction để tối ưu code (hoi chatGPT :D )

    const userId = req.jwtDecoded.id;
    const { booksBorrow } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Nguoi dung không hợp lệ" });
    }

    let queryInsert = [];

    let bookIdToDeleteInCart = [];

    for (const book of booksBorrow) {
      const [bookFind, existingBorrow] = await Promise.all([
        Book.findById(book.book),
        BorrowRecord.findOne({
          book: book.book,
          status: { $ne: "returned" },
        }),
      ]);

      if (!bookFind) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Sách không tồn tại" });
      }

      if (bookFind.available < book.quantity) {
        return res
          .status(StatusCodes.NOT_ACCEPTABLE)
          .json({ message: "Sách không khả dụng" });
      }

      if (existingBorrow) {
        return res
          .status(StatusCodes.NOT_ACCEPTABLE)
          .json({ message: "Có sách bạn đã mượn mà chưa trả" });
      }

      bookFind.available -= book.quantity;
      await bookFind.save();

      queryInsert.push({ ...book, user: userId });
      bookIdToDeleteInCart.push(book.book);
    }

    const createdBorrowRecords = await BorrowRecord.insertMany(queryInsert);

    // xóa bản trong cart
    await Cart.deleteMany({
      user: userId,
      book: { $in: bookIdToDeleteInCart },
    });

    return res.status(StatusCodes.CREATED).json({
      message: "Mượn sách thành công",
      borrowRecords: createdBorrowRecords,
    });
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

    const userBorrowReq = await BorrowRecord.find({
      user: user._id,
    }).populate({
      path: "book",
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
