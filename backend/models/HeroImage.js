import mongoose from "mongoose";

const heroImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },

    // Cloudinary public_id, needed to delete the actual image file
    // from Cloudinary storage (not just the database record).
    publicId: {
      type: String,
      required: true,
    },

    // Controls display order in the homepage hero slider.
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const HeroImage =
  mongoose.models.HeroImage ||
  mongoose.model("HeroImage", heroImageSchema);

export default HeroImage;
