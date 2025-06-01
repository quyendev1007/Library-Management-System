import { Router } from "express";
import authRouter from "./authRouter.js";
import bookRouter from "./bookRouter.js";

const router = Router();

//  import Routes
router.use("/auth", authRouter);
router.use("/books", bookRouter);

export default router;
