import express from "express";
import {
  createCategory,
  deleteCategoryAndUpdateBooks,
  getCategoryById,
  updateCategory,
  getAllCategories,
} from "../controllers/categoryController";
import { validateRequest } from "../middlewares/validateRequest";
import { categorySchema } from "../validations/categoryValidation";
import { isAuthorized } from "../middlewares/authMiddleware";
import { isValidPermission } from "../middlewares/rbacMiddleware";

const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategoryById);

categoryRouter.use(isAuthorized, isValidPermission(["admin"]));
categoryRouter.post("/", validateRequest(categorySchema), createCategory);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategoryAndUpdateBooks);

export default categoryRouter;
