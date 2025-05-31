import { Router } from "express";
import { isValidPermission } from "../middlewares/rbacMiddleware";
import { isAuthorized } from "../middlewares/authMiddleware";

const bookRouter = Router();

// Import routes
bookRouter
  .route("/")
  .get(isAuthorized, isValidPermission(["admin", "client"]), (req, res) => {
    res.status(200).json({
      message: "Welcome to the list Book API",
      version: "1.0.0",
    });
  });

export default bookRouter;
