import { Router } from "express";
import bookRouter from "./book";
import authRouter from "./auth";
import authorRouter from "./author";

const router = Router();

//  import Routes
router.use("/auth", authRouter);

router.use("/books", bookRouter);

router.use("/authors", authorRouter);

export default router;
