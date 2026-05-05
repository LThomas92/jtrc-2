import { useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '@hooks/useSearch';
import { useCart } from '@store/useCart';
import { getImageUrl } from '@lib/getImageUrl';

// Mirror the same bg gradient classes used in MenuCard
const BG_CLASSES = ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'bg-5', 'bg-6'];

function ResultThumb({ item, index }) {
  const bgClass = `menu-card__bg--${(item.bg || BG_CLASSES[index % 6]).replace('bg-', '')}`;
  const imgSrc  = item.image ? getImageUrl(item.image) : null;

  return (
    <span className={`search-overlay__result-thumb menu-card__bg ${bgClass}`}>
      {imgSrc
        ? <img src={imgSrc} alt="" className="search-overlay__result-thumb-img" />
        : <span className="search-overlay__result-thumb-emoji">{item.emoji || '🍽️'}</span>
      }
    </span>
  );
}

export default function GlobalSearch({ open, onClose }) {
  const navigate = useNavigate();
  const addItem  = useCart((s) => s.addItem);
  const inputRef = useRef(null);

  const {
    query, setQuery,
    results,
    loading,
    cursor,
    onKeyDown,
    clear,
  } = useSearch();

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      clear();
    }
  }, [open]); // eslint-disable-line

  const handleClose = useCallback(() => {
    clear();
    onClose();
  }, [clear, onClose]);

  // Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handleClose]);

  const handleSelect = (result) => {
    if (result.type === 'menu') {
      addItem({ id: result.id, name: result.title, price: result.price, emoji: result.emoji });
    }
    navigate(result.href);
    handleClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && cursor >= 0 && results[cursor]) {
      handleSelect(results[cursor]);
    }
    onKeyDown(e);
  };

  const menuResults    = results.filter((r) => r.type === 'menu');
  const packageResults = results.filter((r) => r.type === 'package');
  const hasResults     = results.length > 0;
  const showEmpty      = !loading && query.trim().length > 0 && !hasResults;

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="search-overlay__backdrop" onClick={handleClose} />

      {/* Panel */}
      <div className="search-overlay__panel">

        {/* Input row */}
        <div className="search-overlay__input-row">
          <svg className="search-overlay__input-icon" width="18" height="18"
            fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>

          <input
            ref={inputRef}
            className="search-overlay__input"
            type="text"
            placeholder="Search dishes, packages…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck="false"
          />

          <div className="search-overlay__input-actions">
            {loading && <span className="search-overlay__spinner" />}
            {query && (
              <button className="search-overlay__clear" onClick={() => setQuery('')}>
                <svg width="12" height="12" fill="none" stroke="currentColor"
                  strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            )}
            <button className="search-overlay__close" onClick={handleClose}>
              <svg width="14" height="14" fill="none" stroke="currentColor"
                strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
              <span>esc</span>
            </button>
          </div>
        </div>

        {/* Results */}
        {(hasResults || showEmpty || loading) && (
          <div className="search-overlay__results">

            {/* Skeleton */}
            {loading && (
              <div className="search-overlay__section">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="search-overlay__skeleton" />
                ))}
              </div>
            )}

            {/* Menu items */}
            {!loading && menuResults.length > 0 && (
              <div className="search-overlay__section">
                <div className="search-overlay__section-label">Dishes</div>
                {menuResults.map((r, i) => (
                  <button
                    key={r.id}
                    className={`search-overlay__result ${cursor === i ? 'search-overlay__result--active' : ''}`}
                    onClick={() => handleSelect(r)}
                  >
                    {/* Real card thumbnail */}
                    <ResultThumb item={r} index={i} />

                    <span className="search-overlay__result-body">
                      <span className="search-overlay__result-title">
                        {highlight(r.title, query)}
                      </span>
                      <span className="search-overlay__result-sub">
                        {r.subtitle}
                        {r.tag && (
                          <span className="search-overlay__result-tag">{r.tag}</span>
                        )}
                      </span>
                    </span>

                    <span className="search-overlay__result-right">
                      <span className="search-overlay__result-price">${r.price}</span>
                      <span className="search-overlay__result-action">Add to basket →</span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Packages */}
            {!loading && packageResults.length > 0 && (
              <div className="search-overlay__section">
                <div className="search-overlay__section-label">Packages</div>
                {packageResults.map((r, i) => {
                  const idx = menuResults.length + i;
                  return (
                    <button
                      key={r.id}
                      className={`search-overlay__result ${cursor === idx ? 'search-overlay__result--active' : ''}`}
                      onClick={() => handleSelect(r)}
                    >
                      {/* Package gets a ticket-stub style thumb */}
                      <span className="search-overlay__result-thumb search-overlay__result-thumb--pkg">
                        <span className="search-overlay__result-thumb-emoji">🎉</span>
                      </span>

                      <span className="search-overlay__result-body">
                        <span className="search-overlay__result-title">
                          {highlight(r.title, query)}
                        </span>
                        <span className="search-overlay__result-sub">
                          {r.subtitle} · {r.guests}
                        </span>
                      </span>

                      <span className="search-overlay__result-right">
                        <span className="search-overlay__result-price">${r.price}/pp</span>
                        <span className="search-overlay__result-action">View →</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Empty */}
            {showEmpty && (
              <div className="search-overlay__empty">
                <span className="search-overlay__empty-icon">🔍</span>
                <p className="search-overlay__empty-title">
                  Nothing found for <em>"{query}"</em>
                </p>
                <p className="search-overlay__empty-sub">
                  Try "wings", "shrimp", or "celebration"
                </p>
              </div>
            )}

            {/* Keyboard hints */}
            {hasResults && !loading && (
              <div className="search-overlay__footer">
                <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                <span><kbd>↵</kbd> select</span>
                <span><kbd>esc</kbd> close</span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function highlight(text, query) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="search-overlay__mark">{part}</mark>
      : part
  );
}
