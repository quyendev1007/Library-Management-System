import mongoose from "mongoose";

const borrowRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: { type: Number, required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: Date,
    status: {
      type: String,
      enum: ["borrowed", "returned", "overdue"],
      default: "borrowed",
    },
    bookSnapshot: {
      title: String,
      image: [String],
      description: String,
      author: { name: String },
      publisher: { name: String },
      category: { name: String },
      quantity: Number,
      available: Number,
      publishedYear: Number,
    },
    userSnapshot: {
      name: String,
      email: String,
      phone: String,
      adresses: [String],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const BorrowRecord = mongoose.model("BorrowRecord", borrowRecordSchema);

export default BorrowRecord;
