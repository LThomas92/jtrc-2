import { Link } from 'react-router-dom';

const COLS = [
  {
    title: 'Order',
    links: [
      { to: '/menu',      label: 'Menu' },
      { to: '/packages',  label: 'Packages'  },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/our-story',  label: 'Our Story' },
      { to: '/reviews', label: 'Reviews'   },
      { to: '/contact', label: 'Contact'   },
    ],
  },
  {
    title: 'Help',
    links: [
      { to: '/faq',      label: 'FAQ'      },
      { to: '/policies', label: 'Policies' },
      { to: '/privacy',  label: 'Privacy'  },
    ],
  },
];

const PAY = ['Visa', 'MasterCard', 'Amex', 'Discover', 'Apple Pay'];

const SOCIALS = [
  {
    key: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/jtrusticcuisine',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor"
        strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@jtrusticcuisine',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor"
        strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/people/jtrusticcuisine/100086876037668/?mibextid=LQQJ4d',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor"
        strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">

          {/* Brand + socials */}
          <div>
            <div className="footer__logo">JT's Rustic Cuisine</div>
            <div className="footer__logo-sub">— A Comfort Food Cookbook —</div>
            <p className="footer__tag">
              Scratch-made Southern comfort catering for Long Island's most
              meaningful gatherings since 2018.
            </p>
            <div className="footer__socials">
              {SOCIALS.map((s) => (
                <a key={s.key} href={s.href} className="footer__soc"
                  aria-label={s.label} target="_blank" rel="noopener noreferrer">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <div className="footer__col-title">{col.title}</div>
              <ul className="footer__links">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <div className="footer__copy">
            © {new Date().getFullYear()} JT's Rustic Cuisine · All Rights Reserved
          </div>
          <div className="footer__pay-row">
            {PAY.map((p) => (
              <div key={p} className="footer__pay">{p}</div>
            ))}
          </div>
        </div>

        {/* Credit */}
        <div className="footer__credit">
          <span>Designed &amp; built by</span>
          <a
            href="https://www.lawscodes.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__credit-link"
          >
            Laws &amp; Codes
            <svg width="10" height="10" fill="none" stroke="currentColor"
              strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

      </div>
    </footer>
  );
}
