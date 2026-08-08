import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    subCategory: {
      type: String,
      required: true,
    },

    sizes: {
      type: Array,
      default: [],
    },

    bestseller: {
      type: Boolean,
      default: false,
    },

    image: {
      type: Array,
      default: [],
    },
    // ⭐ Average Rating
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // ⭐ Total Reviews
    reviewsCount: {
      type: Number,
      default: 0,
    },

    date: {
      type: Number,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);

export default Product;

