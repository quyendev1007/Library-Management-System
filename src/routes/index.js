import { Router } from "express";
import bookRouter from "./book";
import authRouter from "./auth";

const router = Router();

//  import Routes
router.use("/auth", authRouter);
router.use("/books", bookRouter);

export default router;
