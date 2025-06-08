import { Router } from "express";
import { authorController } from "../controllers/authorController.js";
import { isAuthorized } from "../middlewares/authMiddleware.js";
import { isValidPermission } from "../middlewares/rbacMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { authorSchema } from "../validations/authorValidation.js";

const authorRouter = Router();

authorRouter
  .route("/")
  .get(authorController.getAllAuthors)
  .post(validateRequest(authorSchema), authorController.createAuthor);

authorRouter
  .route("/:id")
  .get(authorController.getAuthorById)
  .put(authorController.updateAuthor)
  .delete(authorController.deleteAuthor);

export default authorRouter;
