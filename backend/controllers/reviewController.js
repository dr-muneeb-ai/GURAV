import Review from "../models/Review.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

// =======================
// Add Review
// =======================

export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

if (!productId) {
  return res.status(400).json({
    success: false,
    message: "Product is required.",
  });
}

if (!rating || Number(rating) < 1 || Number(rating) > 5) {
  return res.status(400).json({
    success: false,
    message: "Rating must be between 1 and 5.",
  });
}

const user = await User.findById(req.user.id);

if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found.",
  });
}

const alreadyReviewed = await Review.findOne({
  productId,
  userId: req.user.id,
});

if (alreadyReviewed) {
  return res.status(400).json({
    success: false,
    message: "You have already reviewed this product.",
  });
}

const hasPurchased = await Order.findOne({
  userId: req.user.id,
  status: "Delivered",
  items: {
    $elemMatch: {
      productId,
    },
  },
});

if (!hasPurchased) {
  return res.status(400).json({
    success: false,
    message: "You can review only delivered products.",
  });
}

    const review = await Review.create({
      productId,
      userId: req.user.id,
      rating: Number(rating),
      comment,
      verifiedPurchase: !!hasPurchased,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// Get Product Reviews
// =======================

export const getProductReviews = async (req, res) => {
  try {

    const reviews = await Review.find({
      productId: req.params.productId,
    })
      .populate("userId", "name profileImage")
      .sort({ createdAt: -1 });

    const reviewsCount = reviews.length;

    const averageRating =
      reviewsCount === 0
        ? 0
        : Number(
            (
              reviews.reduce(
                (sum, item) => sum + item.rating,
                0
              ) / reviewsCount
            ).toFixed(1)
          );

    res.json({
      success: true,
      reviews,
      reviewsCount,
      averageRating,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// Get Latest Reviews (across all products - for homepage)
// =======================

export const getLatestReviews = async (req, res) => {
  try {

    const limit = Number(req.query.limit) || 12;

    // Prefer well-written, highly-rated reviews for the homepage showcase.
    // Falls back to recency if there aren't enough 4-5 star reviews yet.
    let reviews = await Review.find({
      rating: { $gte: 4 },
      comment: { $ne: "" },
    })
      .populate("userId", "name profileImage")
      .populate("productId", "name image")
      .sort({ createdAt: -1 })
      .limit(limit);

    if (reviews.length < limit) {
      const excludeIds = reviews.map((r) => r._id);

      const fallback = await Review.find({
        _id: { $nin: excludeIds },
        comment: { $ne: "" },
      })
        .populate("userId", "name profileImage")
        .populate("productId", "name image")
        .sort({ createdAt: -1 })
        .limit(limit - reviews.length);

      reviews = [...reviews, ...fallback];
    }

    res.json({
      success: true,
      reviews,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
