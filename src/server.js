import express from "express";
import dotenv from "dotenv";
import router from "./routes";
import morgan from "morgan";
import connectDB from "./config/connectDB.js";

dotenv.config();
const app = express();

connectDB();

app.use(express.json());

app.use(morgan("dev"));

app.use(express.static("public"));

app.use("/api", router);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
