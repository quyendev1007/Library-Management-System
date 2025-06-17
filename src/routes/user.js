import { Router } from "express";
import { userController } from "../controllers/user";
import { isAuthorized } from "../middlewares/authMiddleware";
import { isValidPermission } from "../middlewares/rbacMiddleware";

const userRouter = Router();

userRouter.use(isAuthorized);

userRouter.get("/:id", userController.getUserById);
userRouter.get("/", isValidPermission(["admin"]), userController.getAllUsers);
userRouter.put(
  "/:id",
  isValidPermission(["admin", "client"]),
  userController.updateUser
);
userRouter.delete(
  "/:id",
  isValidPermission(["admin"]),
  userController.deleteUser
);

export default userRouter;
