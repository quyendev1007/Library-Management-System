import express from "express";
import {
  createPublisher,
  getAllPublishers,
  getPublisherById,
  updatePublisher,
  deletePublisher,
} from "../controllers/publisherController.js";
import { publisherSchema } from "../validations/publishervalidation.js";
// phần này có cần middlewares không nếu ko cần anh chị xóa đi hộ em!
import { validate } from "../middlewares/validate.js";

const router = express.Router();
router.post("/", validate(publisherSchema), createPublisher);
router.get("/", getAllPublishers);
router.get("/:id", getPublisherById);

router.put("/:id", validate(publisherSchema), updatePublisher);
router.delete("/:id", deletePublisher);

export default router;
