// ─── Global error handler ─────────────────────────────────────────────────────
const errorHandler = (err, req, res, next) => {
  console.error("[ERROR]", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors).map((e) => ({
        field:   e.path,
        message: e.message,
      })),
    });
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }

  // Duplicate key (unique index)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({ message: `${field} already exists` });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
};

// ─── 404 catch-all ───────────────────────────────────────────────────────────
const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// ─── Wrap async route handlers so errors flow to errorHandler ─────────────────
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { errorHandler, notFound, asyncHandler };
