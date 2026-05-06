const jwt    = require("jsonwebtoken");
const crypto = require("crypto");
const User   = require("../models/User");

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const valid = await user.comparePassword(password);
    if (!valid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -resetToken -resetTokenExpiry");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/forgot-password
// Generates a reset token and logs the reset URL to the server console
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success — don't reveal whether email exists
    if (!user) {
      return res.json({ message: "If that email exists, a reset link has been generated." });
    }

    // Generate a secure random token
    const token  = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetToken       = token;
    user.resetTokenExpiry = expiry;
    await user.save({ validateBeforeSave: false });

    // Build reset URL — check for custom domain first, fall back to Railway URL
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${baseUrl}/admin/reset-password?token=${token}`;

    // Log prominently to Railway console — copy this URL to reset your password
    console.log("\n========================================");
    console.log("🔑 PASSWORD RESET LINK (expires in 1 hour):");
    console.log(resetUrl);
    console.log("========================================\n");

    res.json({ message: "If that email exists, a reset link has been generated. Check your Railway logs for the URL." });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res.status(400).json({ message: "Token and new password required" });

    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters" });

    const user = await User.findOne({
      resetToken:       token,
      resetTokenExpiry: { $gt: new Date() }, // not expired
    });

    if (!user)
      return res.status(400).json({ message: "Reset link is invalid or has expired." });

    // Set new password — pre-save hook will hash it
    user.password          = password;
    user.resetToken        = undefined;
    user.resetTokenExpiry  = undefined;
    await user.save();

    console.log(`✓ Password reset successful for ${user.email}`);

    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
