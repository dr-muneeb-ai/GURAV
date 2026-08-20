import express from "express";

import {
  listVideos,
  addVideo,
  updateVideo,
  deleteVideo,
} from "../controllers/videoController.js";

import adminAuth from "../middleware/adminAuth.js";
import uploadVideo from "../middleware/uploadVideo.js";

const videoRouter = express.Router();

// Public - the frontend Instagram section fetches these
videoRouter.get("/list", listVideos);

// Admin only
videoRouter.post(
  "/add",
  adminAuth,
  uploadVideo.single("video"),
  addVideo
);

videoRouter.put(
  "/:id",
  adminAuth,
  uploadVideo.single("video"),
  updateVideo
);

videoRouter.delete("/:id", adminAuth, deleteVideo);

export default videoRouter;
