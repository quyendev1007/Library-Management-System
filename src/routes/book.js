import { Router } from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/BooksControllers.js";
import { isAuthorized } from "../middlewares/authMiddleware.js";
import { isValidPermission } from "../middlewares/rbacMiddleware.js";

const bookRouter = Router();

bookRouter.get(
  "/",
  isAuthorized,
  isValidPermission(["admin", "client"]),
  (req, res) => {
    res.status(200).json({
      message: "Welcome to the Book API",
      version: "1.0.0",
    });
  }
);

bookRouter.get(
  "/all",
  isAuthorized,
  isValidPermission(["admin", "client"]),
  getAllBooks
);

bookRouter.get(
  "/:id",
  isAuthorized,
  isValidPermission(["admin", "client"]),
  getBookById
);

bookRouter.post(
  "/",
  isAuthorized,
  isValidPermission(["admin"]),
  createBook
);

bookRouter.put(
  "/:id",
  isAuthorized,
  isValidPermission(["admin"]),
  updateBook
);

bookRouter.delete(
  "/:id",
  isAuthorized,
  isValidPermission(["admin"]),
  deleteBook
);

export default bookRouter;
