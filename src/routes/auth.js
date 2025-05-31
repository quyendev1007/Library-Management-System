import { Router } from "express";
import { getCurrentUser, login, register } from "../controllers/auth";
import { validateRequest } from "../middlewares/validateRequest";
import { loginSchema, registerSchema } from "../validations/auth";
import { verifyJWT } from "../middlewares/authMiddleware";

const authRouter = Router();

authRouter.post("/register", validateRequest(registerSchema), register);
authRouter.post("/login", validateRequest(loginSchema), login);
authRouter.get("/getCurrentUser", verifyJWT, getCurrentUser);

export default authRouter;
