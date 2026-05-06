import { useEffect, useState } from 'react';
import { menuAPI } from '@lib/api';
import MenuCard from '@components/home/MenuCard.jsx';

const CATEGORIES = [
  { id: 'all',              label: 'All'              },
  { id: 'breakfast-brunch', label: 'Breakfast & Brunch'},
  { id: 'pastas',           label: 'Pasta'            },
  { id: 'poultry',          label: 'Poultry'          },
  { id: 'meat',             label: 'Meat'             },
  { id: 'seafood',          label: 'Seafood'          },
  { id: 'sides',            label: 'Sides'            },
];

export default function MenuPage() {
  const [items,          setItems]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    menuAPI
      .getAll()
      .then((res) => setItems(res.data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  const countFor = (id) =>
    id === 'all' ? items.length : items.filter((i) => i.category === id).length;

  return (
    <section className="page">
      <header className="page__header">
        <div className="page__folio">Ch. 03 — The Full Menu</div>
        <h1 className="page__title">
          Every <em>dish</em> we make
        </h1>
        <p className="page__sub">
          Browse our complete collection of scratch-made comfort food.
        </p>
      </header>

      <div className="menu__filter">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`menu__filter-btn ${
              activeCategory === cat.id ? 'menu__filter-btn--active' : ''
            }`}
          >
            {cat.label}
            <sup>{countFor(cat.id)}</sup>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="page__empty">Loading menu…</p>
      ) : filtered.length === 0 ? (
        <p className="page__empty">No items in this category yet.</p>
      ) : (
        <div className="menu__grid" style={{ marginTop: '60px' }}>
          {filtered.map((item, i) => (
            <MenuCard key={item._id || item.id} item={item} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
