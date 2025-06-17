import express from "express";
import {
  deleteBorrowRecord,
  getAllRequestBorrow,
  getUserRecords,
  requestBorrow,
  updateRecordStatus,
} from "../controllers/borowController";
import { isValidPermission } from "../middlewares/rbacMiddleware";
import { checkOverdue } from "../middlewares/borrowMiddleware";
import { isAuthorized } from "../middlewares/authMiddleware";

const borrowRouter = express.Router();

borrowRouter.use(isAuthorized);

borrowRouter.get("/", isValidPermission(["admin"]), getAllRequestBorrow);
borrowRouter.put("/:id", isValidPermission(["admin"]), updateRecordStatus);
borrowRouter.delete("/:id", isValidPermission(["admin"]), deleteBorrowRecord);

borrowRouter.use(isValidPermission(["client"]));
borrowRouter.post("/", requestBorrow);
borrowRouter.get("/user", getUserRecords);

export default borrowRouter;
