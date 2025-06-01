import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Vui lòng cung cấp tên sách"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  author: {
    type: String,
    required: [true, "Vui lòng cung cấp tên tác giả"],
    trim: true,
  },
  publisher: {
    type: String,
    required: [true, "Vui lòng cung cấp nhà xuất bản"],
    trim: true,
  },
  publishYear: {
    type: Number,
    required: [true, "Vui lòng cung cấp năm xuất bản"],
    min: [1000, "Năm xuất bản không hợp lệ"],
  },
  category: {
    type: String,
    trim: true,
    default: "Chưa phân loại",
  },
  available: {
    type: Boolean,
    default: true,
  },
  totalCopies: {
    type: Number,
    default: 1,
    min: [0, "Số lượng phải lớn hơn hoặc bằng 0"],
  },
  borrowedCopies: {
    type: Number,
    default: 0,
    min: [0, "Số lượng mượn không hợp lệ"],
  },
}, {
  timestamps: true,
  versionKey: false,
});

const Book = mongoose.model("Book", BookSchema);
export default Book;
