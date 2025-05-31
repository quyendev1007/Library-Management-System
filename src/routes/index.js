import { Router } from "express";
import authRouter from "./auth";

const router = Router();

// Import routes
router.use("/auth", authRouter);

router.get("/", (req, res) => {
  res.send("Welcome to the API");
});

export default router;
