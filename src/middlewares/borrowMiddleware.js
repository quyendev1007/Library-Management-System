import BorrowRecord from "../models/borrowRecord";

export const checkOverdue = async (req, res, next) => {
  try {
    const now = new Date();
    await BorrowRecord.updateMany(
      {
        status: "borrowed",
        dueDate: { $lt: now },
      },
      { status: "overdue" }
    );
    next();
  } catch (error) {
    console.log("Lỗi khi tự động kiểm tra overdue", error);
    next();
  }
};
