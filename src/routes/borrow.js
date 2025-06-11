import express from "express";
import {
  getAllRequestBorrow,
  requestBorrow,
} from "../controllers/borowController";
import { isAuthorized } from "../middlewares/authMiddleware";
import { isValidPermission } from "../middlewares/rbacMiddleware";

const borrowRouter = express.Router();
borrowRouter.get("/", getAllRequestBorrow);

// borrowRouter.use(isValidPermission("client"));
borrowRouter.post("/", isAuthorized, requestBorrow);

export default borrowRouter;
