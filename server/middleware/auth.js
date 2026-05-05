const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ─── Protect routes — requires valid JWT ─────────────────────────────────────
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user   = user;
    req.userId = user._id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ─── Require a specific role ──────────────────────────────────────────────────
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

// ─── Optional auth — attaches user if token present, never fails ──────────────
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return next();

  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select("-password");
    if (user) {
      req.user   = user;
      req.userId = user._id;
    }
  } catch {
    // silently ignore — token invalid or expired, continue as guest
  }

  next();
};

module.exports = { authenticate, requireRole, optionalAuth };
