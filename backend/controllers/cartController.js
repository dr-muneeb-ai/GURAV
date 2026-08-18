import User from "../models/User.js";

// ================= Add To Cart =================
// Body: { itemId, size }
// Requires auth middleware (req.user.id)

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, size } = req.body;

    if (!itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "Item and size are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartData = user.cartData
      ? structuredClone(user.cartData)
      : {};

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {
        [size]: 1,
      };
    }

    user.cartData = cartData;
    // cartData is a Mixed/Object type, so mongoose needs an explicit
    // nudge to know it changed and should be persisted.
    user.markModified("cartData");

    await user.save();

    res.json({
      success: true,
      message: "Added to cart",
      cartData: user.cartData,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Update Cart =================
// Body: { itemId, size, quantity }
// quantity <= 0 removes that size from the cart.

const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, size, quantity } = req.body;

    if (!itemId || !size || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Item, size and quantity are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartData = user.cartData
      ? structuredClone(user.cartData)
      : {};

    if (!cartData[itemId]) {
      return res.json({
        success: true,
        message: "Cart updated",
        cartData: user.cartData,
      });
    }

    if (quantity <= 0) {
      delete cartData[itemId][size];

      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    user.cartData = cartData;
    user.markModified("cartData");

    await user.save();

    res.json({
      success: true,
      message: "Cart updated",
      cartData: user.cartData,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Get User Cart =================
// Requires auth middleware (req.user.id)

const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      cartData: user.cartData || {},
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { addToCart, updateCart, getUserCart };
