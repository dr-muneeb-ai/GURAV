import express from "express";

import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

import {
  getMyChat,
  sendCustomerMessage,
  getAllChats,
  getAdminChat,
  sendAdminMessage,
  deleteChat,
} from "../controllers/chatController.js";

const router = express.Router();

// ==================================================
// CUSTOMER ROUTES
// ==================================================

// Get logged-in customer's previous chat
router.get("/my", auth, getMyChat);

// Customer sends message
router.post("/send", auth, sendCustomerMessage);


// ==================================================
// ADMIN ROUTES
// ==================================================

// Get all customer chats
router.get("/admin/all", adminAuth, getAllChats);

// Get one customer chat
router.get("/admin/:chatId", adminAuth, getAdminChat);

// Admin sends reply
router.post("/admin/:chatId/send", adminAuth, sendAdminMessage);

// Admin deletes complete chat
router.delete("/admin/:chatId", adminAuth, deleteChat);

export default router;
