const express        = require("express");
const router         = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

router.post("/login",           authController.login);
router.get("/me",               authenticate, authController.me);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password",  authController.resetPassword);

module.exports = router;
