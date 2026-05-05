import { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '@store/useCart';
import GlobalSearch from '@components/ui/GlobalSearch.jsx';

const LINKS = [
  { num: '01', label: 'Menu',      to: '/menu'     },
  { num: '02', label: 'Packages',  to: '/packages' },
  { num: '03', label: 'Our Story', to: '/our-story'   },
  { num: '04', label: 'Contact',   to: '/contact'  },
];

export default function Nav() {
  const count = useCart((s) => s.count());
  const location = useLocation();
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  const openSearch  = useCallback(() => setSearchOpen(true),  []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // "/" shortcut for search
  useEffect(() => {
    const handler = (e) => {
      if (
        e.key === '/' &&
        !searchOpen &&
        document.activeElement.tagName !== 'INPUT' &&
        document.activeElement.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        openSearch();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [searchOpen, openSearch]);

  return (
    <>
      <nav className={`nav ${searchOpen ? 'nav--search-open' : ''} ${mobileOpen ? 'nav--mobile-open' : ''}`}>

        {/* ── Left links (desktop) ─────────────────── */}
        <div className="nav__group nav__group--left">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className="nav__link" data-num={l.num}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* ── Logo (always visible) ────────────────── */}
        <Link to="/" className="nav__logo">
          JT's Rustic Cuisine
          <small>— A Comfort Food Cookbook —</small>
        </Link>

        {/* ── Right actions (desktop) ──────────────── */}
        <div className="nav__group nav__group--right">
          <button
            className={`nav__search-btn ${searchOpen ? 'nav__search-btn--active' : ''}`}
            onClick={openSearch}
            aria-label="Open search"
            title="Search  ( / )"
          >
            <svg width="17" height="17" fill="none" stroke="currentColor"
              strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          </button>

          <Link to="/cart" className="nav__cart"
            aria-label={`Basket — ${count} item${count !== 1 ? 's' : ''}`}>
            <div className="nav__cart-icon-wrap">
              <svg className="nav__cart-icon" width="22" height="22"
                fill="none" stroke="currentColor" strokeWidth="1.5"
                viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
                  strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 6h18" strokeLinecap="round" />
                <path d="M16 10a4 4 0 01-8 0"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {count > 0 && (
                <span className="nav__cart-dot">{count > 99 ? '99+' : count}</span>
              )}
            </div>
          </Link>

          <Link to="/menu" className="nav__order">
            Order Now <span>→</span>
          </Link>
        </div>

        {/* ── Mobile right — cart + hamburger ──────── */}
        <div className="nav__mobile-right">
          <Link to="/cart" className="nav__cart"
            aria-label={`Basket — ${count} item${count !== 1 ? 's' : ''}`}>
            <div className="nav__cart-icon-wrap">
              <svg className="nav__cart-icon" width="22" height="22"
                fill="none" stroke="currentColor" strokeWidth="1.5"
                viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
                  strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 6h18" strokeLinecap="round" />
                <path d="M16 10a4 4 0 01-8 0"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {count > 0 && (
                <span className="nav__cart-dot">{count > 99 ? '99+' : count}</span>
              )}
            </div>
          </Link>

          <button
            className={`nav__hamburger ${mobileOpen ? 'nav__hamburger--open' : ''}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* ── Mobile drawer ─────────────────────────── */}
      <div className={`nav__drawer ${mobileOpen ? 'nav__drawer--open' : ''}`}>
        <div className="nav__drawer-inner">
          <div className="nav__drawer-folio">Navigation</div>

          <nav className="nav__drawer-links">
            {LINKS.map((l, i) => (
              <NavLink
                key={l.to}
                to={l.to}
                className="nav__drawer-link"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="nav__drawer-num">{l.num}</span>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav__drawer-divider" />

          <Link to="/menu" className="nav__drawer-cta">
            Order Now <span>→</span>
          </Link>

          <button
            className="nav__drawer-search"
            onClick={() => { setMobileOpen(false); openSearch(); }}
          >
            <svg width="15" height="15" fill="none" stroke="currentColor"
              strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            Search the menu
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div className="nav__drawer-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      <GlobalSearch open={searchOpen} onClose={closeSearch} />
    </>
  );
}
