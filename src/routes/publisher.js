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
// phần này có cần middlewares không nếu ko cần anh chị xóa đi hộ em!
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();
router.post("/", validateRequest(publisherSchema), createPublisher);
router.get("/", getAllPublishers);

router.get("/all", getAll);

router.get("/:id", getPublisherById);

router.put("/:id", validateRequest(publisherSchema), updatePublisher);
router.delete("/:id", deletePublisher);

export default router;
