import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@store/useCart';
import { getImageUrl } from '@lib/getImageUrl';
import toast from 'react-hot-toast';

export default function VariationsModal({ item, onClose }) {
  const addItem = useCart((s) => s.addItem);

  // selections[groupId] = optionId  (single)
  // selections[groupId] = Set of optionIds  (multiple)
  const [selections, setSelections] = useState({});
  const [added,      setAdded]      = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // ── Selection logic ────────────────────────────────────
  const toggle = (group, optionId) => {
    setSelections((prev) => {
      const next = { ...prev };
      if (group.type === 'single') {
        next[group._id] = optionId;
      } else {
        const set = new Set(prev[group._id] || []);
        set.has(optionId) ? set.delete(optionId) : set.add(optionId);
        next[group._id] = set;
      }
      return next;
    });
  };

  const isSelected = (group, optionId) => {
    if (group.type === 'single') return selections[group._id] === optionId;
    return (selections[group._id] || new Set()).has(optionId);
  };

  // ── Price calculation ──────────────────────────────────
  const totalPrice = () => {
    let total = item.price || 0;
    (item.variations || []).forEach((group) => {
      group.options.forEach((opt) => {
        if (isSelected(group, String(opt._id))) {
          total += opt.priceAdd || 0;
        }
      });
    });
    return total;
  };

  // ── Validation ─────────────────────────────────────────
  const isValid = () => {
    return (item.variations || []).every((group) => {
      if (!group.required) return true;
      if (group.type === 'single') return !!selections[group._id];
      return (selections[group._id]?.size || 0) > 0;
    });
  };

  // ── Build label summary for cart ───────────────────────
  const buildVariationLabel = () => {
    const parts = [];
    (item.variations || []).forEach((group) => {
      if (group.type === 'single') {
        const optId = selections[group._id];
        const opt   = group.options.find((o) => String(o._id) === optId);
        if (opt) parts.push(`${group.name}: ${opt.label}`);
      } else {
        const ids  = selections[group._id] || new Set();
        const opts = group.options.filter((o) => ids.has(String(o._id)));
        if (opts.length) parts.push(`${group.name}: ${opts.map((o) => o.label).join(', ')}`);
      }
    });
    return parts.join(' · ');
  };

  // ── Add to cart ────────────────────────────────────────
  const handleAdd = () => {
    if (!isValid()) {
      toast.error('Please make all required selections');
      return;
    }

    const price         = totalPrice();
    const variationNote = buildVariationLabel();

    addItem({
      id:            String(item._id),
      name:          item.name,
      price,
      emoji:         item.emoji,
      image:         item.image || '',
      variationNote,
    });

    setAdded(true);
    toast.success(`Added ${item.name}`);
    setTimeout(() => { setAdded(false); onClose(); }, 900);
  };

  const price     = totalPrice();
  const basePrice = item.price || 0;
  const priceAdd  = price - basePrice;
  const valid     = isValid();

  return (
    <div className="var-modal__backdrop" onClick={handleBackdrop}>
      <div className="var-modal">

        {/* Image header */}
        <div className="var-modal__head">
          {item.image ? (
            <img src={getImageUrl(item.image)} alt={item.name} className="var-modal__img" />
          ) : (
            <div className="var-modal__img-fallback">{item.emoji || '🍽️'}</div>
          )}
          <div className="var-modal__head-overlay">
            <div className="var-modal__category">{item.categoryLabel || item.category}</div>
            <h2 className="var-modal__title">{item.name}</h2>
            <p className="var-modal__desc">{item.description}</p>
          </div>
          <button className="var-modal__close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" fill="none" stroke="currentColor"
              strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Variation groups */}
        <div className="var-modal__body">
          {(item.variations || []).map((group) => (
            <div key={group._id} className="var-modal__group">
              <div className="var-modal__group-header">
                <span className="var-modal__group-name">{group.name}</span>
                <div className="var-modal__group-meta">
                  <span className="var-modal__group-type">
                    {group.type === 'single' ? 'Choose one' : 'Choose all that apply'}
                  </span>
                  {group.required && (
                    <span className="var-modal__required">Required</span>
                  )}
                </div>
              </div>

              <div className={`var-modal__options ${group.type === 'multiple' ? 'var-modal__options--multi' : ''}`}>
                {group.options.map((opt) => {
                  const selected = isSelected(group, String(opt._id));
                  return (
                    <button
                      key={opt._id}
                      type="button"
                      className={`var-modal__option ${selected ? 'var-modal__option--selected' : ''}`}
                      onClick={() => toggle(group, String(opt._id))}
                    >
                      <span className="var-modal__option-check">
                        {group.type === 'single' ? (
                          <span className="var-modal__radio" />
                        ) : (
                          <span className="var-modal__checkbox">
                            {selected && (
                              <svg width="10" height="10" fill="none" stroke="currentColor"
                                strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M20 6L9 17l-5-5" strokeLinecap="round" />
                              </svg>
                            )}
                          </span>
                        )}
                      </span>
                      <span className="var-modal__option-label">{opt.label}</span>
                      {opt.priceAdd > 0 && (
                        <span className="var-modal__option-price">+${opt.priceAdd.toFixed(2)}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="var-modal__footer">
          <div className="var-modal__price-wrap">
            <span className="var-modal__price-total">${price.toFixed(2)}</span>
            {priceAdd > 0 && (
              <span className="var-modal__price-base">
                Base ${basePrice.toFixed(2)} + ${priceAdd.toFixed(2)}
              </span>
            )}
          </div>

          <button
            className={`var-modal__add-btn ${!valid ? 'var-modal__add-btn--disabled' : ''} ${added ? 'var-modal__add-btn--added' : ''}`}
            onClick={handleAdd}
            disabled={added}
          >
            {added ? (
              <>
                <svg width="14" height="14" fill="none" stroke="currentColor"
                  strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" />
                </svg>
                Added!
              </>
            ) : (
              <>Add to Basket → </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
