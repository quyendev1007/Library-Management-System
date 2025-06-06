import { Router } from "express";
import bookRouter from "./book";
import authRouter from "./auth";
import authorRouter from "./author";
import publisherRouter from "./publisher";
import categoryRouter from "./category";
import userRouter from "./user";

const router = Router();

//  import Routes
router.use("/auth", authRouter);
router.use("/books", bookRouter);
router.use("/authors", authorRouter);
router.use("/publishers", publisherRouter);
router.use("/categories", categoryRouter);
router.use("/users", userRouter);

export default router;
