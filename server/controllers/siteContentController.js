const SiteContent      = require("../models/SiteContent");
const { uploadBuffer } = require("../middleware/cloudinary");

exports.getContent = async (req, res) => {
  try {
    let doc = await SiteContent.findOne({ key: "global" });
    if (!doc) doc = new SiteContent();
    res.json({ content: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateContent = async (req, res) => {
  try {
    const heroData      = req.body.hero      ? JSON.parse(req.body.hero)      : {};
    const aboutData     = req.body.about     ? JSON.parse(req.body.about)     : {};
    const postcardsData = req.body.postcards ? JSON.parse(req.body.postcards) : null;

    // Hero featured image
    if (req.files?.heroImage?.[0]) {
      heroData.featuredImageUrl = await uploadBuffer(
        req.files.heroImage[0].buffer, "jts-hero"
      );
    }

    // About photo
    if (req.files?.aboutPhoto?.[0]) {
      aboutData.mainPhotoUrl = await uploadBuffer(
        req.files.aboutPhoto[0].buffer, "jts-about"
      );
    }

    // Postcard cards — merge text data with any newly uploaded images
    let cards = postcardsData?.cards || null;

    if (req.files) {
      if (!cards) {
        const existing = await SiteContent.findOne({ key: "global" });
        cards = (existing?.postcards?.cards || []).map(c => ({
          imageUrl: c.imageUrl,
          dishName: c.dishName,
          text:     c.text,
          author:   c.author,
          event:    c.event,
          city:     c.city,
          date:     c.date,
          year:     c.year,
        }));
      }

      for (let i = 0; i < 6; i++) {
        const fieldName = `postcardImage_${i}`;
        if (req.files[fieldName]?.[0]) {
          const url = await uploadBuffer(req.files[fieldName][0].buffer, "jts-postcards");
          if (!cards[i]) {
            cards[i] = { imageUrl: url, dishName: "", text: "", author: "", event: "", city: "", date: "", year: "" };
          } else {
            cards[i] = { ...cards[i], imageUrl: url };
          }
        }
      }
    }

    const flatSet = {};
    Object.entries(heroData).forEach(([k, v])  => { flatSet[`hero.${k}`]  = v; });
    Object.entries(aboutData).forEach(([k, v]) => { flatSet[`about.${k}`] = v; });
    if (cards !== null) flatSet["postcards.cards"] = cards;

    const doc = await SiteContent.findOneAndUpdate(
      { key: "global" },
      { $set: flatSet },
      { new: true, upsert: true, runValidators: false }
    );

    res.json({ content: doc });
  } catch (err) {
    console.error("UPDATE SITE CONTENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
