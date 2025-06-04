import mongoose from "mongoose";

const borrowRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: Date,
    status: {
      type: String,
      enum: ["borrowed", "returned", "overdue"],
      default: "borrowed",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const BorrowRecord = mongoose.model("BorrowRecord", borrowRecordSchema);

export default BorrowRecord;
