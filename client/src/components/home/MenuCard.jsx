import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '@store/useCart';
import { getImageUrl } from '@lib/getImageUrl';
import VariationsModal from '@components/ui/VariationsModal.jsx';

export default function MenuCard({ item, index = 0 }) {
  const addItem = useCart((s) => s.addItem);
  const [added,      setAdded]      = useState(false);
  const [showModal,  setShowModal]  = useState(false);

  const hasVariations = item.variations && item.variations.length > 0;

  const handleAdd = (e) => {
    e.stopPropagation();

    // If item has variations, open the modal instead of adding directly
    if (hasVariations) {
      setShowModal(true);
      return;
    }

    addItem({
      id:    item.id || item._id,
      name:  item.name,
      price: item.price,
      emoji: item.emoji,
      image: item.image || '',
    });
    setAdded(true);
    toast.success(`Added ${item.name}`);
    setTimeout(() => setAdded(false), 1800);
  };

  const rotClass = `menu-card--rot-${(index % 6) + 1}`;
  const bgClass  = `menu-card__bg--${(item.bg || 'bg-1').replace('bg-', '')}`;
  const imageUrl = item.image ? getImageUrl(item.image) : null;

  return (
    <>
      <div className={`menu-card ${rotClass}`} data-cursor="pointer">
        <div className="menu-card__inner">
          <div className="menu-card__img">
            <div className={`menu-card__bg ${bgClass}`}>
              {imageUrl ? (
                <img src={imageUrl} alt={item.name} className="menu-card__photo" />
              ) : (
                <div className="menu-card__emoji">{item.emoji}</div>
              )}
            </div>

            {item.postmark && (
              <div className="menu-card__postmark">
                <div className="menu-card__postmark-outer">
                  <div className="menu-card__postmark-inner">
                    {item.postmark.line1}<br />
                    <b>{item.postmark.line2}</b><br />
                    {item.postmark.line3}
                  </div>
                </div>
              </div>
            )}

            {item.seal && <div className="menu-card__seal">{item.seal}</div>}

            {/* Variations hint badge */}
            {hasVariations && (
              <div className="menu-card__variations-hint">
                {item.variations.length} option{item.variations.length !== 1 ? 's' : ''}
              </div>
            )}

            <button
              className="menu-card__add"
              aria-label={`Add ${item.name} to cart`}
              onClick={handleAdd}
            >
              {added ? (
                <svg width="18" height="18" fill="none" stroke="#FAF3E0"
                  strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg width="18" height="18" fill="none" stroke="#1C1811"
                  strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              )}
            </button>
          </div>

          <div className="menu-card__meta">
            <span className="menu-card__num">
              {item.num} · {item.categoryLabel || item.category}
            </span>
            <span className="menu-card__tag">{item.tag}</span>
          </div>

          <h3 className="menu-card__title">{item.name}</h3>
          <div className="menu-card__rule" />
          <p className="menu-card__ing">{item.description}</p>

          <div className="menu-card__footer">
            <span className="menu-card__serves">{item.serves}</span>
            <span className="menu-card__price">
              {hasVariations ? `From $${item.price}` : `$${item.price}`}
            </span>
          </div>
        </div>

        {item.handNote && (
          <div className="menu-card__hand-note">
            {item.handNote}
            <svg viewBox="0 0 40 30" fill="none">
              <path d="M4 4 Q 20 10, 28 20 M28 20 L22 18 M28 20 L26 14"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Variations modal */}
      {showModal && (
        <VariationsModal
          item={item}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
