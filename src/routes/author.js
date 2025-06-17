import { Router } from "express";
import { authorController } from "../controllers/authorController.js";
import { isValidPermission } from "../middlewares/rbacMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { authorSchema } from "../validations/authorValidation.js";
import { isAuthorized } from "./../middlewares/authMiddleware";

const authorRouter = Router();

authorRouter.use(isAuthorized, isValidPermission(["admin"]));
authorRouter.get("/all", authorController.getAll);

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
