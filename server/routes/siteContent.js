const express               = require("express");
const router                = express.Router();
const siteContentController = require("../controllers/siteContentController");
const { authenticate }      = require("../middleware/auth");
const { upload }            = require("../middleware/cloudinary");

router.get("/", siteContentController.getContent);

// upload.fields() parses heroImage and aboutPhoto into req.files
// NO handleCloudinaryUpload here — the controller calls uploadBuffer directly
router.put("/",
  authenticate,
  upload.fields([
    { name: "heroImage",  maxCount: 1 },
    { name: "aboutPhoto", maxCount: 1 },
  ]),
  siteContentController.updateContent
);

module.exports = router;
