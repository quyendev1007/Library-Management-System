import { Router } from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/booksControllers.js";
import { isAuthorized } from "../middlewares/authMiddleware.js";
import { isValidPermission } from "../middlewares/rbacMiddleware.js";

const bookRouter = Router();

bookRouter.get("/all", getAllBooks);

bookRouter.get("/:id", getBookById);

// bookRouter.use(isAuthorized);
// bookRouter.use(isValidPermission("admin"));

bookRouter.post("/", createBook);

bookRouter.put("/:id", updateBook);

bookRouter.delete("/:id", deleteBook);

export default bookRouter;
