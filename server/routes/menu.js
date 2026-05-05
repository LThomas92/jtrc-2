const express  = require("express");
const router   = express.Router();
const { upload, handleCloudinaryUpload } = require("../middleware/cloudinary");
const {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");
const { authenticate } = require("../middleware/auth");

// Public
router.get("/", getMenu);

// Admin — upload.single parses the file into memory, handleCloudinaryUpload streams it up
router.post("/",
  authenticate,
  upload.single("image"),
  handleCloudinaryUpload,
  createMenuItem
);

router.put("/:id",
  authenticate,
  upload.single("image"),
  handleCloudinaryUpload,
  updateMenuItem
);

router.patch("/:id",
  authenticate,
  upload.single("image"),
  handleCloudinaryUpload,
  updateMenuItem
);

router.delete("/:id", authenticate, deleteMenuItem);

module.exports = router;
