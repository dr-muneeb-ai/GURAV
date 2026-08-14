import Chat from "../models/Chat.js";
import User from "../models/User.js";

// ============================
// CUSTOMER - GET MY CHAT
// ============================

export const getMyChat = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let chat = await Chat.findOne({ userId });

    // First time customer opens chat
    if (!chat) {
      chat = await Chat.create({
        userId,
        messages: [
          {
            sender: "admin",
            message: "👋 Hello! Welcome to Drip District.",
          },
          {
            sender: "admin",
            message: "How can we help you today?",
          },
        ],
      });
    }

    res.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// CUSTOMER - SEND MESSAGE
// ============================

export const sendCustomerMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let chat = await Chat.findOne({ userId });

    if (!chat) {
      chat = await Chat.create({
        userId,
        messages: [],
      });
    }

    chat.messages.push({
      sender: "customer",
      message: message.trim(),
    });

    await chat.save();

    res.json({
      success: true,
      message: "Message sent successfully.",
      chat,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// ADMIN - GET ALL CUSTOMER CHATS
// ==================================================

export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({})
      .populate("userId", "name email")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      chats,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// ADMIN - GET SINGLE CUSTOMER CHAT
// ==================================================

export const getAdminChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate("userId", "name email");

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    res.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// ADMIN - SEND MESSAGE
// ==================================================

export const sendAdminMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    chat.messages.push({
      sender: "admin",
      message: message.trim(),
    });

    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate("userId", "name email");

    res.json({
      success: true,
      message: "Reply sent successfully.",
      chat: updatedChat,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==================================================
// ADMIN - DELETE CHAT
// ==================================================

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found.",
      });
    }

    await Chat.findByIdAndDelete(chatId);

    res.json({
      success: true,
      message: "Chat deleted successfully.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
