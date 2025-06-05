import mongoose from "mongoose";

let isConnected = false;

// do pass có chứa ký tự đặc biệt

const connectDB = async () => {
  const password = encodeURIComponent(process.env.PASS_MONGO);
  const mongoUri = `${
    process.env.MONGODB_URI_BEFORE + password + process.env.MONGODB_URI_AFTER
  }`;

  if (isConnected) {
    console.log("Đã kết nối MongoDB trước đó.");
    return;
  }

  try {
    console.log(mongoUri);

    await mongoose.connect(mongoUri);

    isConnected = true;
    console.log("Kết nối MongoDB thành công.");
  } catch (error) {
    console.error("Lỗi kết nối MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
