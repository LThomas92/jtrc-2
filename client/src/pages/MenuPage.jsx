import { useEffect, useState } from 'react';
import { menuAPI } from '@lib/api';
import MenuCard from '@components/home/MenuCard.jsx';

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
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
        {['all', 'appetizer', 'entree', 'side', 'seafood'].map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`menu__filter-btn ${
              activeCategory === c ? 'menu__filter-btn--active' : ''
            }`}
          >
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1) + 's'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="page__empty">Loading menu…</p>
      ) : filtered.length === 0 ? (
        <p className="page__empty">
          Menu items will appear here once the server is running.
        </p>
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
