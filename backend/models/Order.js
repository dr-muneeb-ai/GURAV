import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        _id: false,

        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        name: String,

        category: String,

        image: [String],

        price: Number,

        quantity: Number,

        size: String,
      },
    ],

    address: {
      firstName: String,
      lastName: String,
      email: String,
      street: String,
      city: String,
      state: String,
      country: String,
      pinCode: String,
      phone: String,
    },

    amount: {
      type: Number,
      required: true,
    },

    codFee: {
      type: Number,
      default: 0,
    },

    // "cod" | "stripe" | "paypal"
    paymentMethod: {
      type: String,
      default: "cod",
    },

    // true once payment is confirmed (COD stays false until delivery/collection)
    payment: {
      type: Boolean,
      default: false,
    },

    // Stripe payment_intent id / PayPal capture id
    transactionId: {
      type: String,
      default: "",
    },

    paymentDate: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      default: "Order Placed",
    },

    date: {
      type: Number,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Order =
  mongoose.models.Order ||
  mongoose.model("Order", orderSchema);

export default Order;
