import { MenuItem } from '../models/MenuItem.js';
import { Package } from '../models/Package.js';
import { asyncHandler } from '../middleware/error.js';

export const search = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').trim();

  if (!q || q.length < 1) {
    return res.json({ results: [] });
  }

  const regex = new RegExp(q, 'i');

  const [menuItems, packages] = await Promise.all([
    MenuItem.find({
      available: true,
      $or: [
        { name: regex },
        { description: regex },
        { category: regex },
        { tag: regex },
      ],
    })
      .select('name description price category categoryLabel emoji tag bg num')
      .limit(6),

    Package.find({
      $or: [{ name: regex }, { label: regex }, { guests: regex }],
    })
      .select('name label guests price featured')
      .limit(3),
  ]);

  const results = [
    ...menuItems.map((item) => ({
      type:        'menu',
      id:          item._id,
      title:       item.name,
      subtitle:    item.categoryLabel || item.category,
      description: item.description,
      price:       item.price,
      emoji:       item.emoji || '🍽️',
      tag:         item.tag,
      href:        '/menu',
    })),
    ...packages.map((pkg) => ({
      type:     'package',
      id:       pkg._id,
      title:    `The ${pkg.name}`,
      subtitle: pkg.label,
      price:    pkg.price,
      guests:   pkg.guests,
      emoji:    '🎉',
      href:     '/packages',
    })),
  ];

  res.json({ results, query: q });
});
