import express from "express";
import {
  getAllRequestBorrow,
  getUserRecords,
  requestBorrow,
  updateRecordStatus,
} from "../controllers/borowController";
import { isAuthorized } from "../middlewares/authMiddleware";
import { isValidPermission } from "../middlewares/rbacMiddleware";
import { checkOverdue } from "../middlewares/borrowMiddleware";

const borrowRouter = express.Router();
borrowRouter.use(checkOverdue).use(isAuthorized);
// borrowRouter.use(isValidPermission(["admin"]));

borrowRouter.get("/", getAllRequestBorrow);
borrowRouter.put("/:id", updateRecordStatus);

// borrowRouter.use(isValidPermission(["client"]));
borrowRouter.post("/", requestBorrow);
borrowRouter.get("/user", getUserRecords);

export default borrowRouter;
