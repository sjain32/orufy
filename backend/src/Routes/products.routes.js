import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  createProduct,
  getAdminProducts,
  updateProduct,
  deleteProduct,
  togglePublish,
} from "../controllers/products.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", createProduct);
router.get("/", getAdminProducts);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.patch("/:id/toggle-publish", togglePublish);

export default router;
