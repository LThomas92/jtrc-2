const SiteContent      = require("../models/SiteContent");
const { uploadBuffer } = require("../middleware/cloudinary");

// GET /api/site-content — public
exports.getContent = async (req, res) => {
  try {
    let doc = await SiteContent.findOne({ key: "global" });
    if (!doc) doc = new SiteContent();
    res.json({ content: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/site-content — admin only
exports.updateContent = async (req, res) => {
  try {
    console.log("FILES RECEIVED:", Object.keys(req.files || {}));
    console.log("BODY KEYS:", Object.keys(req.body || {}));

    const heroData  = req.body.hero  ? JSON.parse(req.body.hero)  : {};
    const aboutData = req.body.about ? JSON.parse(req.body.about) : {};

    // Upload hero featured image if provided
    if (req.files?.heroImage?.[0]) {
      console.log("Uploading heroImage to Cloudinary...");
      heroData.featuredImageUrl = await uploadBuffer(
        req.files.heroImage[0].buffer,
        "jts-hero"
      );
      console.log("Hero image URL:", heroData.featuredImageUrl);
    }

    // Upload about photo if provided
    if (req.files?.aboutPhoto?.[0]) {
      console.log("Uploading aboutPhoto to Cloudinary...");
      aboutData.mainPhotoUrl = await uploadBuffer(
        req.files.aboutPhoto[0].buffer,
        "jts-about"
      );
    }

    // Dot-notation $set — only touches individual fields,
    // never wipes fields not included in this request
    const flatSet = {};
    Object.entries(heroData).forEach(([k, v])  => { flatSet[`hero.${k}`]  = v; });
    Object.entries(aboutData).forEach(([k, v]) => { flatSet[`about.${k}`] = v; });

    console.log("Saving flatSet keys:", Object.keys(flatSet));

    const doc = await SiteContent.findOneAndUpdate(
      { key: "global" },
      { $set: flatSet },
      { new: true, upsert: true, runValidators: false }
    );

    console.log("Saved featuredImageUrl:", doc.hero?.featuredImageUrl);

    res.json({ content: doc });
  } catch (err) {
    console.error("UPDATE SITE CONTENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
