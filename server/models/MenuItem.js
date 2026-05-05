const mongoose = require("mongoose");

const variationOptionSchema = new mongoose.Schema(
  {
    label:    { type: String, required: true },
    priceAdd: { type: Number, default: 0 },   // extra cost, 0 = free
  },
  { _id: true }
);

const variationGroupSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true }, // "Size", "Sauce", "Add-on"
    type:     { type: String, enum: ["single", "multiple"], default: "single" },
    required: { type: Boolean, default: true },
    options:  [variationOptionSchema],
  },
  { _id: true }
);

const menuItemSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    description: String,
    price:       Number,
    category:    String,
    image:       String,
    featured:    { type: Boolean, default: false },
    variations:  [variationGroupSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
