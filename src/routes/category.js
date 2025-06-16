import express from "express";
import {
  createCategory,
  deleteCategoryAndUpdateBooks,
  getCategoryById,
  updateCategory,
  getAllCategories,
} from "../controllers/categoryController";
import { isAuthorized } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import { categorySchema } from "../validations/categoryValidation";

const categoryRouter = express.Router();

// categoryRouter.use(isValidPermission(["client"]));
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategoryById);

// categoryRouter.use(isValidPermission(["admin"]));
categoryRouter.use(isAuthorized).use(validateRequest(categorySchema));
categoryRouter.post("/", createCategory);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategoryAndUpdateBooks);

export default categoryRouter;
