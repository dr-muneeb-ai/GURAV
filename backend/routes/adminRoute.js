import express from "express";

import {

adminLogin,

dashboardData,

} from "../controllers/userController.js";

import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);

adminRouter.get(
  "/dashboard",
  adminAuth,
  dashboardData
);

export default adminRouter;
