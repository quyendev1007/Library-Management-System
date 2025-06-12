import { CartController } from "../controllers/cartController";

import { Router } from "express";
import { isAuthorized } from "../middlewares/authMiddleware";

const cartRouter = Router();
cartRouter.use(isAuthorized);
cartRouter
  .route("/:id")
  .get(CartController.getAllCardsByUserId)
  .patch(CartController.updateCartQuantity)
  .delete(CartController.deleteCart);

cartRouter.route("/").post(CartController.createCart);

export default cartRouter;
