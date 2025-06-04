import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Vui lòng cung cấp tên sách"],
      trim: true,
    },
    image: [
      {
        type: String,
        required: [true, "Vui lòng cung cấp hình ảnh sách"],
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
    publisher: { type: mongoose.Schema.Types.ObjectId, ref: "Publisher" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    quantity: Number,
    available: Number,
    publishedYear: {
      type: Number,
      required: [true, "Vui lòng cung cấp năm xuất bản"],
      min: [1000, "Năm xuất bản không hợp lệ"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Book = mongoose.model("Book", BookSchema);
export default Book;
