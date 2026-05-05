const mongoose = require("mongoose");

// Clear cached model so schema changes take effect on restart
delete mongoose.connection.models["SiteContent"];
delete mongoose.models["SiteContent"];

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: "global", unique: true },

    hero: {
      line1:            { type: String, default: "Food made" },
      line2:            { type: String, default: "with soul," },
      line3:            { type: String, default: "served with love." },
      description:      { type: String, default: "Scratch-made Southern comfort catering for the gatherings that matter most — from Sunday dinners to grand celebrations, all prepared with real ingredients and real heart." },
      featuredDish:     { type: String, default: "Fried Mac & Cheese Balls" },
      featuredDesc:     { type: String, default: "Four-cheese béchamel, golden breadcrumb crust, smoked paprika aioli." },
      featuredPrice:    { type: String, default: "$45" },
      featuredServes:   { type: String, default: "Serves · 12" },
      featuredCaption:  { type: String, default: "— Fried Mac & Cheese Balls —" },
      featuredImageUrl: { type: String, default: "" },   // ← hero featured dish photo
    },

    about: {
      stickerYears:      { type: String, default: "8+" },
      stickerText:       { type: String, default: "✦ Since 2018 · Long Island New York · Made With Love" },
      mainPhotoUrl:      { type: String, default: "" },
      mainPhotoCaption:  { type: String, default: "— Chef Jessy T in the kitchen —" },
      smallPhotoCaption: { type: String, default: "fresh herbs" },
      title:             { type: String, default: "Born from a belief that great food brings people home." },
      body:              { type: String, default: "JT's Rustic Cuisine was founded on a simple idea — food should taste like a memory. Every dish we serve is made from scratch in our New York kitchen, using real ingredients and recipes passed down through generations of family cooks. No shortcuts. No substitutions. Just comfort food with soul." },
      quote:             { type: String, default: "My mother taught me that cooking isn't about following a recipe — it's about feeding the people you love." },
      chefSignature:     { type: String, default: "— Chef Jessy T" },
      chefName:          { type: String, default: "Jessica Thomas" },
      chefRole:          { type: String, default: "Founder & Head Chef" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteContent", siteContentSchema);
