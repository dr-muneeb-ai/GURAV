import HeroImage from "../models/HeroImage.js";
import cloudinary from "../config/cloudinary.js";

const MAX_HERO_IMAGES = 6;

// ================= Helper: Upload buffer to Cloudinary =================

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "gurav-hero" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

// ================= List Hero Images (public) =================

const listHeroImages = async (req, res) => {
  try {
    const images = await HeroImage.find().sort({ order: 1 });

    res.json({
      success: true,
      images,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Add Hero Image (admin) =================

const addHeroImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image to upload",
      });
    }

    const currentCount = await HeroImage.countDocuments();

    if (currentCount >= MAX_HERO_IMAGES) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${MAX_HERO_IMAGES} hero images allowed. Delete one to add a new image.`,
      });
    }

    const result = await uploadToCloudinary(req.file.buffer);

    const heroImage = await HeroImage.create({
      imageUrl: result.secure_url,
      publicId: result.public_id,
      order: currentCount + 1,
    });

    res.status(201).json({
      success: true,
      message: "Hero image added successfully",
      image: heroImage,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Update Hero Image (admin) - replace the file =================

const updateHeroImage = async (req, res) => {
  try {
    const heroImage = await HeroImage.findById(req.params.id);

    if (!heroImage) {
      return res.status(404).json({
        success: false,
        message: "Hero image not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a new image to upload",
      });
    }

    try {
      await cloudinary.uploader.destroy(heroImage.publicId);
    } catch (cloudErr) {
      console.log("Old hero image cleanup failed:", cloudErr.message);
    }

    const result = await uploadToCloudinary(req.file.buffer);

    heroImage.imageUrl = result.secure_url;
    heroImage.publicId = result.public_id;
    await heroImage.save();

    res.json({
      success: true,
      message: "Hero image updated successfully",
      image: heroImage,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= Delete Hero Image (admin) =================

const deleteHeroImage = async (req, res) => {
  try {
    const heroImage = await HeroImage.findById(req.params.id);

    if (!heroImage) {
      return res.status(404).json({
        success: false,
        message: "Hero image not found",
      });
    }

    try {
      await cloudinary.uploader.destroy(heroImage.publicId);
    } catch (cloudErr) {
      console.log("Cloudinary delete failed:", cloudErr.message);
    }

    await HeroImage.findByIdAndDelete(req.params.id);

    // Re-number remaining images so order stays sequential (1,2,3...)
    const remaining = await HeroImage.find().sort({ order: 1 });

    await Promise.all(
      remaining.map((img, index) =>
        HeroImage.findByIdAndUpdate(img._id, { order: index + 1 })
      )
    );

    res.json({
      success: true,
      message: "Hero image deleted successfully",
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
  listHeroImages,
  addHeroImage,
  updateHeroImage,
  deleteHeroImage,
};
