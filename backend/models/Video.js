import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    videoUrl: {
      type: String,
      required: true,
    },

    // Cloudinary public_id, needed to delete the actual video file
    // from Cloudinary storage (not just the database record).
    publicId: {
      type: String,
      required: true,
    },

    // Controls display order in the Instagram grid (1 = first slot).
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Video =
  mongoose.models.Video || mongoose.model("Video", videoSchema);

export default Video;
