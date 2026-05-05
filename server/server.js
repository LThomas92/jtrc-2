require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const mongoose = require("mongoose");
const path     = require("path");

const app = express();

const authRoutes        = require("./routes/auth");
const menuRoutes        = require("./routes/menu");
const packagesRoutes    = require("./routes/packages");
const ordersRoutes      = require("./routes/orders");
const searchRoutes      = require("./routes/search");
const siteContentRoutes = require("./routes/siteContent");
const contactRoutes     = require("./routes/contact");

const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://jtsrusticcuisine.com",
  "https://www.jtsrusticcuisine.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Range"],
  exposedHeaders: ["Content-Range", "Accept-Ranges", "Content-Length"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

const uploadsPath = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use("/api/auth",         authRoutes);
app.use("/api/menu",         menuRoutes);
app.use("/api/packages",     packagesRoutes);
app.use("/api/orders",       ordersRoutes);
app.use("/api/search",       searchRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api/contact",      contactRoutes);

mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => console.log("✓ MongoDB connected"))
  .catch(err => console.error("✗ MongoDB connection error:", err));

app.listen(PORT, () => console.log(`✓ Server running on port ${PORT}`));
