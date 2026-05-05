const cloudinary   = require("cloudinary").v2;
const multer       = require("multer");
const { Readable } = require("stream");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Memory storage — nothing touches disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ext     = require("path").extname(file.originalname).toLowerCase();
  const mime    = file.mimetype;
  if (allowed.test(ext) && allowed.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpg, png, webp, gif)"), false);
  }
};

// Shared multer instance — use .single(), .fields(), or .array() on it in routes
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 4 * 1024 * 1024 },
});

// ── Shared upload helper ──────────────────────────────────
// Upload a buffer to Cloudinary and return the secure URL
const uploadBuffer = (buffer, folder = "jts-menu") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width: 1200, height: 900, crop: "fill", gravity: "auto" },
          { quality: "auto:good" },
          { fetch_format: "auto" },
        ],
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });

// ── Single-file middleware ────────────────────────────────
// For routes that use upload.single("image") — sets req.cloudinaryUrl
const handleCloudinaryUpload = async (req, res, next) => {
  if (!req.file) return next();
  try {
    req.cloudinaryUrl = await uploadBuffer(req.file.buffer);
    next();
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return res.status(500).json({ message: "Image upload failed" });
  }
};

module.exports = { upload, handleCloudinaryUpload, uploadBuffer };
