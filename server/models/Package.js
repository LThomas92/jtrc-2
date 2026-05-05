const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    slug:     { type: String, required: true, unique: true },
    label:    { type: String, required: true },
    name:     { type: String, required: true },
    guests:   { type: String },
    price:    { type: Number, required: true },
    minimum:  { type: String },
    features: [{ type: String }],   // what's included service-wise
    includes: [{ type: String }],   // food items in this package
    featured: { type: Boolean, default: false },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);
