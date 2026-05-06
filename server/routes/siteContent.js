const express               = require("express");
const router                = express.Router();
const siteContentController = require("../controllers/siteContentController");
const { authenticate }      = require("../middleware/auth");
const { upload }            = require("../middleware/cloudinary");

router.get("/", siteContentController.getContent);

router.put("/",
  authenticate,
  upload.fields([
    { name: "heroImage",       maxCount: 1 },
    { name: "aboutPhoto",      maxCount: 1 },
    { name: "postcardImage_0", maxCount: 1 },
    { name: "postcardImage_1", maxCount: 1 },
    { name: "postcardImage_2", maxCount: 1 },
    { name: "postcardImage_3", maxCount: 1 },
    { name: "postcardImage_4", maxCount: 1 },
    { name: "postcardImage_5", maxCount: 1 },
  ]),
  siteContentController.updateContent
);

module.exports = router;
