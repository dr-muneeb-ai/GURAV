import express from "express";

import {
  listHeroImages,
  addHeroImage,
  updateHeroImage,
  deleteHeroImage,
} from "../controllers/heroController.js";

import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const heroRouter = express.Router();

// Public - the frontend Hero section fetches these
heroRouter.get("/list", listHeroImages);

// Admin only
heroRouter.post(
  "/add",
  adminAuth,
  upload.single("image"),
  addHeroImage
);

heroRouter.put(
  "/:id",
  adminAuth,
  upload.single("image"),
  updateHeroImage
);

heroRouter.delete("/:id", adminAuth, deleteHeroImage);

export default heroRouter;
