const express  = require("express");
const router   = express.Router();
const MenuItem = require("../models/MenuItem");
const Package  = require("../models/Package");

// GET /api/search?q=wings
router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json({ results: [] });

    const regex = new RegExp(q, "i");

    // Run both queries — if Package fails, still return menu results
    const [menuItems, packages] = await Promise.all([
      MenuItem.find({
        $or: [
          { name:        regex },
          { description: regex },
          { category:    regex },
        ],
      })
        .select("name description price category image")
        .limit(6),

      Package.find({
        $or: [
          { name:   regex },
          { label:  regex },
          { guests: regex },
        ],
      })
        .select("name label guests price featured")
        .limit(3)
        .catch(() => []),   // ← never let Package crash the whole request
    ]);

    const results = [
      ...menuItems.map((item) => ({
        type:        "menu",
        id:          item._id,
        title:       item.name,
        subtitle:    item.category,
        description: item.description,
        price:       item.price,
        image:       item.image || null,
        emoji:       "🍽️",
        href:        "/menu",
      })),
      ...packages.map((pkg) => ({
        type:     "package",
        id:       pkg._id,
        title:    `The ${pkg.name}`,
        subtitle: pkg.label,
        price:    pkg.price,
        guests:   pkg.guests,
        emoji:    "🎉",
        href:     "/packages",
      })),
    ];

    res.json({ results, query: q });
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
