import express from "express";
import {
  createCategory,
  deleteCategoryAndUpdateBooks,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController";

const categoryRouter = express.Router();
categoryRouter.get("/:id", getCategoryById);
categoryRouter.post("/", createCategory);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategoryAndUpdateBooks);

export default categoryRouter;
