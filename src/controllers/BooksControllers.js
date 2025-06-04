import { StatusCodes } from "http-status-codes";
import Book from "../models/books.js";

export const getAllBooks = async (req, res) => {
  try {
    const search = req.query.search || "";

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalPages = await Book.countDocuments();

    const pages = Math.ceil(totalPages / limit);

    if (totalPages === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không có sách nào trong cơ sở dữ liệu" });
    }

    if (page < 1 || page > pages) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Trang không hợp lệ" });
    }

    let books;

    if (search) {
      books = await Book.find({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      });
      if (books.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Không tìm thấy sách" });
      }
    } else {
      books = await Book.find().limit(limit).skip(skip);
    }

    books.pages = pages;

    res.status(StatusCodes.OK).json(books);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi server", error: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy sách" });

    res.status(StatusCodes.OK).json(book);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(StatusCodes.CREATED).json(newBook);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy sách" });
    res.status(StatusCodes.OK).json(updatedBook);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy sách" });

    res.status(StatusCodes.OK).json({ message: "Xóa sách thành công" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
