import express from "express";

import auth from "../middleware/auth.js";

import {
addReview,
getProductReviews,
getLatestReviews
}
from "../controllers/reviewController.js";

const router = express.Router();

// IMPORTANT: /latest must be declared BEFORE /:productId,
// otherwise Express will treat "latest" as a productId value.
router.get("/latest", getLatestReviews);

router.get("/:productId", getProductReviews);

router.post("/add", auth, addReview);

export default router;
