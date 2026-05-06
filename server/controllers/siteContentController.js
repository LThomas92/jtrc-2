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

    const heroData       = req.body.hero       ? JSON.parse(req.body.hero)       : {};
    const aboutData      = req.body.about      ? JSON.parse(req.body.about)      : {};
    const postcardsData  = req.body.postcards  ? JSON.parse(req.body.postcards)  : null;

    // Hero featured image
    if (req.files?.heroImage?.[0]) {
      heroData.featuredImageUrl = await uploadBuffer(
        req.files.heroImage[0].buffer, "jts-hero"
      );
      console.log("Hero image URL:", heroData.featuredImageUrl);
    }

    // About photo
    if (req.files?.aboutPhoto?.[0]) {
      aboutData.mainPhotoUrl = await uploadBuffer(
        req.files.aboutPhoto[0].buffer, "jts-about"
      );
    }

    // Postcard images — up to 6, keyed as postcardImage_0 … postcardImage_5
    let postcardImages = postcardsData?.images || null;

    // If new files uploaded for specific postcard slots, upload them
    if (req.files) {
      // First fetch existing postcard images from DB so we can merge
      if (!postcardImages) {
        const existing = await SiteContent.findOne({ key: "global" });
        postcardImages = existing?.postcards?.images?.map(i => ({
          _id:      i._id,
          imageUrl: i.imageUrl,
          dishName: i.dishName,
        })) || [];
      }

      for (let i = 0; i < 6; i++) {
        const fieldName = `postcardImage_${i}`;
        if (req.files[fieldName]?.[0]) {
          const url = await uploadBuffer(req.files[fieldName][0].buffer, "jts-postcards");
          if (!postcardImages[i]) {
            postcardImages[i] = { imageUrl: url, dishName: "" };
          } else {
            postcardImages[i] = { ...postcardImages[i], imageUrl: url };
          }
        }
      }
    }

    // Build flat $set using dot-notation — never wipes untouched fields
    const flatSet = {};
    Object.entries(heroData).forEach(([k, v])  => { flatSet[`hero.${k}`]  = v; });
    Object.entries(aboutData).forEach(([k, v]) => { flatSet[`about.${k}`] = v; });
    if (postcardImages !== null) {
      flatSet["postcards.images"] = postcardImages;
    }

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
