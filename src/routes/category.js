import express from "express";
import {
  createCategory,
  deleteCategoryAndUpdateBooks,
  getCategoryById,
  updateCategory,
  getAllCategories,
} from "../controllers/categoryController";

const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.post("/", createCategory);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategoryAndUpdateBooks);

export default categoryRouter;
