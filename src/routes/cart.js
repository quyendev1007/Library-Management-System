import { CartController } from "../controllers/cartController";

import { Router } from "express";

const cartRouter = Router();

cartRouter
  .route("/:id")
  .get(CartController.getAllCardsByUserId)
  .patch(CartController.updateCartQuantity)
  .delete(CartController.deleteCart);

cartRouter.route("/").post(CartController.createCart);

export default cartRouter;
