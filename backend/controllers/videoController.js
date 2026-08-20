import Video from "../models/Video.js";
import cloudinary from "../config/cloudinary.js";

const MAX_VIDEOS = 6;

// ================= Helper: Upload buffer to Cloudinary (video) =================

const uploadVideoToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "gurav-instagram",
        resource_type: "video",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// ================= List Videos (public) =================

const listVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ order: 1 });

    res.json({
      success: true,
      videos,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Add Video (admin) =================

const addVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a video to upload",
      });
    }

    const currentCount = await Video.countDocuments();

    if (currentCount >= MAX_VIDEOS) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${MAX_VIDEOS} videos allowed. Delete one to add a new video.`,
      });
    }

    const result = await uploadVideoToCloudinary(req.file.buffer);

    const video = await Video.create({
      videoUrl: result.secure_url,
      publicId: result.public_id,
      order: currentCount + 1,
    });

    res.status(201).json({
      success: true,
      message: "Video added successfully",
      video,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Update Video (admin) - replace the video file =================

const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a new video to upload",
      });
    }

    // Remove the old file from Cloudinary before uploading the new one
    try {
      await cloudinary.uploader.destroy(video.publicId, {
        resource_type: "video",
      });
    } catch (cloudErr) {
      console.log("Old video cleanup failed:", cloudErr.message);
    }

    const result = await uploadVideoToCloudinary(req.file.buffer);

    video.videoUrl = result.secure_url;
    video.publicId = result.public_id;
    await video.save();

    res.json({
      success: true,
      message: "Video updated successfully",
      video,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Delete Video (admin) =================

const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    try {
      await cloudinary.uploader.destroy(video.publicId, {
        resource_type: "video",
      });
    } catch (cloudErr) {
      console.log("Cloudinary delete failed:", cloudErr.message);
    }

    await Video.findByIdAndDelete(req.params.id);

    // Re-number remaining videos so order stays sequential (1,2,3...)
    // and there are no gaps after a delete.
    const remaining = await Video.find().sort({ order: 1 });

    await Promise.all(
      remaining.map((v, index) =>
        Video.findByIdAndUpdate(v._id, { order: index + 1 })
      )
    );

    res.json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { listVideos, addVideo, updateVideo, deleteVideo };
