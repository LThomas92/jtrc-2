const Package = require("../models/Package");

// GET /api/packages
const list = async (req, res) => {
  try {
    const packages = await Package.find().sort({ order: 1 });
    res.json({ packages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/packages/:id
const getOne = async (req, res) => {
  try {
    const pkg = await Package.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
    }).catch(() => null);

    if (!pkg) return res.status(404).json({ message: "Package not found" });
    res.json({ package: pkg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/packages
const create = async (req, res) => {
  try {
    const { slug, label, name, guests, price, minimum, features, includes, featured, order } = req.body;

    if (!slug || !label || !name || !price) {
      return res.status(400).json({ message: "slug, label, name, and price are required" });
    }

    const existing = await Package.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: `A package with slug "${slug}" already exists` });
    }

    const pkg = await Package.create({
      slug,
      label,
      name,
      guests,
      price,
      minimum,
      features: features || [],
      includes: includes || [],
      featured: featured || false,
      order:    order    || 0,
    });

    res.status(201).json({ package: pkg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/packages/:id
const update = async (req, res) => {
  try {
    const { label, name, guests, price, minimum, features, includes, featured, order } = req.body;

    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      { label, name, guests, price, minimum, features, includes, featured, order },
      { new: true, runValidators: true }
    );

    if (!pkg) return res.status(404).json({ message: "Package not found" });
    res.json({ package: pkg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/packages/:id
const remove = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Package not found" });
    res.json({ message: "Package deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { list, getOne, create, update, remove };
