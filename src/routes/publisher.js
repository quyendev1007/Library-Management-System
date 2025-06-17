import express from "express";
import {
  createPublisher,
  getAllPublishers,
  getPublisherById,
  updatePublisher,
  deletePublisher,
  getAll,
} from "../controllers/publisherController.js";
import { publisherSchema } from "../validations/publishervalidation.js";

import { validateRequest } from "../middlewares/validateRequest.js";
import { isAuthorized } from "../middlewares/authMiddleware.js";
import { isValidPermission } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

router.use(isAuthorized, isValidPermission(["admin"]));

router.post("/", validateRequest(publisherSchema), createPublisher);
router.get("/", getAllPublishers);

router.get("/all", getAll);

router.get("/:id", getPublisherById);

router.put("/:id", validateRequest(publisherSchema), updatePublisher);
router.delete("/:id", deletePublisher);

export default router;
