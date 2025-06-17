import { CartController } from "../controllers/cartController";

import { Router } from "express";
import { isAuthorized } from "../middlewares/authMiddleware";
import { isValidPermission } from "../middlewares/rbacMiddleware";

const cartRouter = Router();

cartRouter.use(isAuthorized, isValidPermission(["client"]));

cartRouter
  .route("/:id")
  .get(CartController.getAllCardsByUserId)
  .patch(CartController.updateCartQuantity)
  .delete(CartController.deleteCart);

cartRouter.route("/").post(CartController.createCart);

export default cartRouter;
