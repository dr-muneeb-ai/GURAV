import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfilePicture,
} from "../controllers/userController.js";

import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

// Logged-in user's own profile
userRouter.get("/profile", auth, getProfile);

userRouter.post(
  "/profile-picture",
  auth,
  upload.single("image"),
  updateProfilePicture
);

export default userRouter;
