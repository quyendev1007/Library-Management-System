import { Router } from "express";

const router = Router();

// Import routes

router.get("/", (req, res) => {
  res.send("Welcome to the API");
});

export default router;
