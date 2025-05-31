import { Router } from "express";
import { getCurrentUser, login, register } from "../controllers/auth";
import { validateRequest } from "../middlewares/validateRequest";
import { loginSchema, registerSchema } from "../validations/auth";
import { isAuthorized } from "../middlewares/authMiddleware";
import { isValidPermission } from "../middlewares/rbacMiddleware";

const authRouter = Router();

authRouter.route("/register").post(validateRequest(registerSchema), register);

authRouter.route("/login").post(validateRequest(loginSchema), login);

authRouter
  .route("/getCurrentUser")
  .get(isAuthorized, isValidPermission(["admin"]), getCurrentUser);

export default authRouter;
