import chatRoute from "./routes/chatRoute.js";
import cartRouter from "./routes/cartRoute.js";
import videoRouter from "./routes/videoRoute.js";
import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import visitorRouter from "./routes/visitorRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
const app = express();
// Trust the first proxy in front of this server (needed on most hosting
// platforms - Render, Railway, Vercel, Nginx, etc.) so req headers reflect
// the visitor's real IP instead of the proxy's IP. Harmless locally too.
app.set("trust proxy", true);
// Database
connectDB();
// Middlewares
app.use(cors());
app.use(express.json());
// Static Files
app.use("/uploads", express.static("uploads"));
// Routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/visitor", visitorRouter);
app.use("/api/review", reviewRouter);
app.use("/api/chat", chatRoute);
app.use("/api/cart", cartRouter);
app.use("/api/video", videoRouter);
// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Gurav Backend Running Successfully",
  });
});
// Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server Running on Port ${PORT}`);
});
