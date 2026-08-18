import express from "express";

import auth from "../middleware/auth.js";
import {
  addToCart,
  updateCart,
  getUserCart,
} from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.post("/add", auth, addToCart);
cartRouter.post("/update", auth, updateCart);
cartRouter.post("/get", auth, getUserCart);

export default cartRouter;
