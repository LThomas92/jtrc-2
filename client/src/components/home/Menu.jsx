import { useEffect, useState } from 'react';
import MenuCard from './MenuCard.jsx';
import { menuAPI } from '@lib/api';

const CATEGORIES = [
  { id: 'all',       label: 'All'        },
  { id: 'appetizer', label: 'Appetizers' },
  { id: 'entree',    label: 'Entrées'    },
  { id: 'side',      label: 'Sides'      },
  { id: 'seafood',   label: 'Seafood'    },
];

export default function Menu() {
  const [items,          setItems]          = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    menuAPI
      .getAll()
      .then((res) => setItems(res.data.items || []))
      .catch((err) => console.error('Failed to load menu:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'all'
    ? items
    : items.filter((item) => item.category === activeCategory);

  // Count per category
  const countFor = (id) =>
    id === 'all' ? items.length : items.filter((i) => i.category === id).length;

  return (
    <section className="menu">
      <div className="torn-edge-top" />

      <div className="menu__inner">
        <div className="menu__header">
          <div className="menu__folio">
            <strong>Ch. 03</strong>
            <span>The Menu</span>
          </div>
          <div className="menu__heading-wrap">
            <h2 className="menu__heading">
              The <em>Crowd</em>-<span className="menu__script">Pleasers</span>
            </h2>
            <p className="menu__sub">
              A handpicked selection of our most-loved dishes
            </p>
          </div>
          <a href="/menu" className="menu__view-all">
            View Full Menu <span>→</span>
          </a>
        </div>

        <div className="menu__filter">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`menu__filter-btn ${
                activeCategory === cat.id ? 'menu__filter-btn--active' : ''
              }`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
              <sup>{countFor(cat.id)}</sup>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="menu__grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="menu-card menu-card--skeleton" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="menu__empty">
            {activeCategory === 'all'
              ? 'Menu items coming soon.'
              : `No ${activeCategory} items yet.`}
          </p>
        ) : (
          <div className="menu__grid">
            {filtered.map((item, i) => (
              <MenuCard key={item._id || item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>

      <div className="torn-edge-bottom" />
    </section>
  );
}
