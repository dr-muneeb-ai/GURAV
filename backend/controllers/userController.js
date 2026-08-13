import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const createToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ================= Register =================

const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password should be at least 6 characters",
      });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= User Login =================

const loginUser = async (req, res) => {
  try {

    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = createToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ================= Admin Login =================

const adminLogin = async (req, res) => {

  try {

    let { email, password } = req.body;

    // Mobile keyboards often auto-capitalize the first letter or add
    // stray spaces, so we normalize both the incoming values and the
    // expected env values before comparing.
    email = email?.trim().toLowerCase();
    password = password?.trim();

    const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const expectedPassword = process.env.ADMIN_PASSWORD?.trim();

    if (
      !email ||
      !password ||
      email !== expectedEmail ||
      password !== expectedPassword
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid Admin Credentials",
      });
    }

    const token = jwt.sign(
      {
        admin: true,
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      token,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= Dashboard Data =================

const dashboardData = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const orders = await Order.find().sort({ createdAt: -1 });

    const revenue = orders.reduce(
      (sum, order) => sum + order.amount,
      0
    );

    const latestOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const latestProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // ================= Monthly Revenue =================

    const monthlyRevenue = new Array(12).fill(0);

    orders.forEach((order) => {
      const month = new Date(order.createdAt).getMonth();
      monthlyRevenue[month] += order.amount;
    });

    // ================= Products By Category =================

    const products = await Product.find({}, "category");

    const categorySales = {
      Hoodies: 0,
      Watches: 0,
      Accessories: 0,
      Sneakers: 0,
    };

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const category = item.category?.trim();

        if (categorySales.hasOwnProperty(category)) {
          categorySales[category] += Number(item.quantity) || 0;
        }
      });
    });

    const totalSales = Object.values(categorySales).reduce(
      (sum, value) => sum + value,
      0
    );

    const colors = {
      Hoodies: "#10b981",
      Watches: "#3b82f6",
      Accessories: "#f97316",
      Sneakers: "#ef4444",
    };

    const salesOverview = Object.keys(categorySales).map((category) => ({
      category,
      percentage:
        totalSales === 0
          ? 0
          : Math.round((categorySales[category] / totalSales) * 100),
      color: colors[category],
    }));

    // ================= Response =================

    res.json({
      success: true,
      stats: {
        revenue,
        totalProducts,
        totalUsers,
        totalOrders,
      },
      latestOrders,
      latestProducts,
      monthlyRevenue,
      salesOverview,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export {
  registerUser,
  loginUser,
  adminLogin,
  dashboardData,
};
