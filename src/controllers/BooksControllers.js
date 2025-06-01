import Book from '../models/Book.js';
import { bookSchema } from '../validators/bookValidator.js';

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Không tìm thấy sách" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const { error } = bookSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { error } = bookSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) return res.status(404).json({ message: "Không tìm thấy sách" });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy sách" });

    res.status(200).json({ message: "Xóa sách thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
