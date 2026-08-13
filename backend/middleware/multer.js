import multer from "multer";

// Memory storage: file disk pe save nahi hoti, seedha buffer ke roop
// mein Cloudinary ko bhej denge. Disk storage isliye hata di kyunki
// Render ka disk restart pe files delete kar deta hai.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
