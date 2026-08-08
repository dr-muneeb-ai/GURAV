import express from "express";

import {
  placeOrder,
  stripePayment,
  paypalPayment,
  verifyPayment,
  userOrders,
  allOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRouter = express.Router();

// ================= USER =================

// Place Order (COD)
orderRouter.post(
  "/place",
  authUser,
  placeOrder
);

// Stripe Payment - creates the Stripe Checkout session
orderRouter.post(
  "/stripe",
  authUser,
  stripePayment
);

// PayPal Payment - creates the PayPal order
orderRouter.post(
  "/paypal",
  authUser,
  paypalPayment
);

// Verify Payment - confirms Stripe/PayPal payment and finalizes the order
orderRouter.post(
  "/verify-payment",
  authUser,
  verifyPayment
);

// User Orders
orderRouter.post(
  "/userorders",
  authUser,
  userOrders
);

// ================= ADMIN =================

// All Orders
orderRouter.get(
  "/list",
  adminAuth,
  allOrders
);

// Update Status
orderRouter.put(
  "/status/:id",
  adminAuth,
  updateOrderStatus
);

// Delete Order
orderRouter.delete(
  "/delete/:id",
  adminAuth,
  deleteOrder
);

export default orderRouter;
