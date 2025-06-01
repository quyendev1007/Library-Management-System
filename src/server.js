import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";

import connectDB from "./config/connectDB.js";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));

app.use("/api", router);

app.use(errorHandlingMiddleware);

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Không thể khởi động server:", err.message);
    process.exit(1);
  }
};

startServer();
