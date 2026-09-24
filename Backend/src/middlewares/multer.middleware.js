// Multer middleware for handling profile image file uploads
import multer from "multer";
import path from "path";
import fs from "fs";

// Store uploaded files in the /uploads directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads");

    // Create the directory automatically if missing
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Unique filename: userId_timestamp.ext
    const userId = req.user?._id || "user";
    const ext = path.extname(file.originalname);
    cb(null, `${userId}_${Date.now()}${ext}`);
  },
});

// Only accept image files (check mimetype and extension)
const ALLOWED_IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isImageMime = /^image\/(jpe?g|png|webp|gif)$/.test(file.mimetype);

  if (isImageMime && ALLOWED_IMAGE_EXT.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, jpeg, png, webp, gif) are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

export default upload;
