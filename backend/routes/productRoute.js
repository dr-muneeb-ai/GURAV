import express from "express";

import {
  addProduct,
  listProducts,
  singleProduct,
  updateProduct,
  removeProduct,
} from "../controllers/productController.js";

import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

// ==================== Public Routes ====================

// Get all products
productRouter.get("/list", listProducts);

// Get single product
productRouter.get("/single/:id", singleProduct);

// ==================== Admin Routes ====================

// Add Product (Max 6 Images)
productRouter.post(
  "/add",
  adminAuth,
  upload.array("image", 6),
  addProduct
);

// Update Product (Max 6 Images)
productRouter.put(
  "/update/:id",
  adminAuth,
  upload.array("image", 6),
  updateProduct
);

// Delete Product
productRouter.delete(
  "/remove/:id",
  adminAuth,
  removeProduct
);

export default productRouter;
