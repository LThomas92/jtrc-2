const mongoose = require("mongoose");

// Clear any cached version of this model so schema changes take effect on restart
delete mongoose.connection.models["Order"];
delete mongoose.models["Order"];

const orderItemSchema = new mongoose.Schema(
  {
    menuItemId: { type: String, required: true },
    name:       { type: String, required: true },
    price:      { type: Number, required: true },
    quantity:   { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name:         { type: String, required: true },
      phone:        { type: String, required: true },
      eventDate:    { type: Date,   required: true },
      instructions: { type: String, default: "" },
    },

    items:    [orderItemSchema],
    subtotal: { type: Number, required: true },

    fulfillmentType: {
      type:    String,
      enum:    ["pickup"],
      default: "pickup",
    },

    paymentMode: {
      type:     String,
      enum:     ["full", "deposit"],
      required: true,
    },

    depositPercent:  { type: Number, default: 25 },
    chargedAmount:   { type: Number, required: true },
    remainingAmount: { type: Number, default: 0 },

    stripePaymentIntentId: { type: String, default: "" },
    stripeClientSecret:    { type: String, default: "" },

    paymentStatus: {
      type:    String,
      enum:    ["pending", "paid", "refunded"],
      default: "pending",
    },

    status: {
      type:    String,
      enum:    ["pending", "confirmed", "ready", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
