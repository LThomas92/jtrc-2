const Order  = require("../models/Order");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const DEPOSIT_PERCENT = 0.25; // 25%

// ─────────────────────────────────────────────────────────
// POST /api/orders
// Creates a Stripe PaymentIntent then saves the order
// ─────────────────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const { customer, items, subtotal, paymentMode } = req.body;

    // Validate required fields
    if (!customer?.name || !customer?.phone || !customer?.eventDate) {
      return res.status(400).json({ message: "name, phone, and eventDate are required" });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must have at least one item" });
    }
    if (!subtotal || subtotal <= 0) {
      return res.status(400).json({ message: "Invalid subtotal" });
    }
    if (!["full", "deposit"].includes(paymentMode)) {
      return res.status(400).json({ message: "paymentMode must be 'full' or 'deposit'" });
    }

    // Calculate how much to charge
    const chargedAmount   = paymentMode === "deposit"
      ? Math.round(subtotal * DEPOSIT_PERCENT * 100) / 100
      : subtotal;
    const remainingAmount = paymentMode === "deposit"
      ? Math.round((subtotal - chargedAmount) * 100) / 100
      : 0;

    // Create Stripe PaymentIntent (amounts in cents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   Math.round(chargedAmount * 100),
      currency: "usd",
      metadata: {
        customerName:  customer.name,
        customerPhone: customer.phone,
        eventDate:     customer.eventDate,
        paymentMode,
      },
    });

    // Save order with pending payment status
    const order = await Order.create({
      customer,
      items,
      subtotal,
      fulfillmentType:       "pickup",
      paymentMode,
      depositPercent:        paymentMode === "deposit" ? 25 : 100,
      chargedAmount,
      remainingAmount,
      stripePaymentIntentId: paymentIntent.id,
      stripeClientSecret:    paymentIntent.client_secret,
      paymentStatus:         "pending",
      status:                "pending",
    });

    // Return the client secret so the frontend can confirm the payment
    res.status(201).json({
      order,
      clientSecret: paymentIntent.client_secret,
      chargedAmount,
      remainingAmount,
    });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────
// POST /api/orders/:id/confirm-payment
// Called after Stripe confirms payment on the client
// ─────────────────────────────────────────────────────────
exports.confirmPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Verify with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(
      order.stripePaymentIntentId
    );

    if (paymentIntent.status === "succeeded") {
      order.paymentStatus = "paid";
      order.status        = "confirmed";
      await order.save();
    }

    res.json({ order });
  } catch (err) {
    console.error("CONFIRM PAYMENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────
// GET /api/orders  (admin)
// ─────────────────────────────────────────────────────────
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────
// GET /api/orders/:id  (admin)
// ─────────────────────────────────────────────────────────
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────
// PATCH /api/orders/:id/status  (admin)
// ─────────────────────────────────────────────────────────
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["pending", "confirmed", "ready", "completed", "cancelled"];
    if (!valid.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${valid.join(", ")}` });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
