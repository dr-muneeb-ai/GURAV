import Product from "../models/Product.js";
import Review from "../models/Review.js";
import cloudinary from "../config/cloudinary.js";

const attachRatings = async (products) => {

  const productArray = Array.isArray(products)
    ? products
    : [products];

  const ids = productArray.map((p) => p._id);

  const stats = await Review.aggregate([

    {
      $match: {
        productId: {
          $in: ids,
        },
      },
    },

    {
      $group: {
        _id: "$productId",
        averageRating: {
          $avg: "$rating",
        },
        reviewsCount: {
          $sum: 1,
        },
      },
    },

  ]);

  const map = {};

  stats.forEach((item) => {

    map[item._id.toString()] = item;

  });

  return productArray.map((product) => {

    const stat = map[product._id.toString()];

    const obj = product.toObject();

    obj.rating = stat
      ? Number(stat.averageRating.toFixed(1))
      : 0;

    obj.reviewsCount = stat
      ? stat.reviewsCount
      : 0;

    return obj;

  });

};

// ================= Helper: Upload buffer to Cloudinary =================

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "gurav-products",
        quality: "auto",
        fetch_format: "auto",
        width: 1600,
        crop: "limit",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// ================= Helper: Parse Tags =================
// Accepts either a JSON stringified array (e.g. '["red","summer"]')
// or a plain comma separated string (e.g. "red, summer") and always
// returns a clean array of lowercase, trimmed, de-duplicated tags.

const parseTags = (rawTags) => {
  if (!rawTags) return [];

  let tagsArray = [];

  try {
    const parsed = JSON.parse(rawTags);
    tagsArray = Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch (err) {
    // Not JSON, fall back to comma separated string
    tagsArray = String(rawTags).split(",");
  }

  const cleaned = tagsArray
    .map((tag) => String(tag).trim().toLowerCase())
    .filter(Boolean);

  return [...new Set(cleaned)];
};

// ================= Add Product =================

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      tags,
      bestseller,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    const images = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: sizes ? JSON.parse(sizes) : [],
      tags: parseTags(tags),
      bestseller: bestseller === "true",
      image: images,
    });

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Product List =================

const listProducts = async (req, res) => {

  try {

    const products = await Product.find().sort({
      createdAt: -1,
    });

    const finalProducts =
      await attachRatings(products);

    res.json({

      success: true,

      products: finalProducts,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};
// ================= Single Product =================

const singleProduct = async (req, res) => {

  try {

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {

      return res.status(404).json({

        success: false,

        message: "Product not found",

      });

    }

    const [finalProduct] =
      await attachRatings([product]);

    res.json({

      success: true,

      product: finalProduct,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ================= Update Product =================

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.name = req.body.name || product.name;
    product.description =
      req.body.description || product.description;
    product.price = req.body.price
      ? Number(req.body.price)
      : product.price;
    product.category =
      req.body.category || product.category;
    product.subCategory =
      req.body.subCategory || product.subCategory;

    if (req.body.sizes) {
      product.sizes = JSON.parse(req.body.sizes);
    }

    if (req.body.tags !== undefined) {
      product.tags = parseTags(req.body.tags);
    }

    if (req.body.bestseller !== undefined) {
      product.bestseller =
        req.body.bestseller === "true";
    }

    // Update images only if new images are uploaded
    if (req.files && req.files.length > 0) {
      product.image = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      );
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Delete Product =================

const removeProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
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
  addProduct,
  listProducts,
  singleProduct,
  updateProduct,
  removeProduct,
};
