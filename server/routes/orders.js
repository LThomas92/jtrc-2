const express          = require("express");
const router           = express.Router();
const ordersController = require("../controllers/ordersController");
const { authenticate } = require("../middleware/auth");

// Public — guest checkout creates order + PaymentIntent
router.post("/", ordersController.createOrder);

// Public — called after Stripe confirms payment on frontend
router.post("/:id/confirm-payment", ordersController.confirmPayment);

// Admin only
router.get("/",              authenticate, ordersController.getAllOrders);
router.get("/:id",           authenticate, ordersController.getOrder);
router.patch("/:id/status",  authenticate, ordersController.updateStatus);

module.exports = router;
