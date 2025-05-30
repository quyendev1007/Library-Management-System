import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Ket noi Db thanh cong");
  } catch (error) {
    console.error("Lỗi kết nối MongoDb", error.message);
    process.exit(1);
  }
};

export default connectDB;
