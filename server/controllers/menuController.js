const MenuItem = require("../models/MenuItem");

// Strip client-generated UUIDs so Mongoose generates real ObjectIds
const sanitizeVariations = (variations) => {
  if (!Array.isArray(variations)) return [];
  return variations.map(({ _id, ...group }) => ({
    ...group,
    options: (group.options || []).map(({ _id: oid, ...opt }) => opt),
  }));
};

// GET /api/menu
exports.getMenu = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === "true";

    const items = await MenuItem.find(filter).sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    console.error("GET MENU ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/menu
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "name and price are required" });
    }

    let variations = [];
    if (req.body.variations) {
      try { variations = sanitizeVariations(JSON.parse(req.body.variations)); } catch {}
    }

    const image = req.cloudinaryUrl || "";
    const item  = await MenuItem.create({ name, description, price, category, image, variations });
    res.status(201).json({ item });
  } catch (err) {
    console.error("CREATE MENU ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/menu/:id
exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    if (req.body.name        !== undefined) item.name        = req.body.name;
    if (req.body.description !== undefined) item.description = req.body.description;
    if (req.body.price       !== undefined) item.price       = req.body.price;
    if (req.body.category    !== undefined) item.category    = req.body.category;
    if (req.body.featured    !== undefined) item.featured    = req.body.featured;

    if (req.body.variations !== undefined) {
      try { item.variations = sanitizeVariations(JSON.parse(req.body.variations)); } catch {}
    }

    if (req.cloudinaryUrl) item.image = req.cloudinaryUrl;

    const updated = await item.save();
    res.json({ message: "Menu item updated", item: updated });
  } catch (err) {
    console.error("UPDATE MENU ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/menu/:id
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json({ message: "Menu item deleted", id: req.params.id });
  } catch (err) {
    console.error("DELETE MENU ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
