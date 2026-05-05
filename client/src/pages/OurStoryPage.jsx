import { useEffect, useState } from 'react';
import { siteContentAPI } from '@lib/api';

const D = {
  mainPhotoUrl:     'http://jtsrusticcuisine.com/wp-content/uploads/2023/05/About-Us-Photo.png',
  mainPhotoCaption: '— Chef Jessy T in the kitchen —',
  title:            'Born from a belief that great food brings people home.',
  body:             "JT's Rustic Cuisine was founded on a simple idea — food should taste like a memory. Every dish we serve is made from scratch in our New York kitchen, using real ingredients and recipes passed down through generations of family cooks. No shortcuts. No substitutions. Just comfort food with soul.",
  quote:            "My mother taught me that cooking isn't about following a recipe — it's about feeding the people you love.",
  chefSignature:    '— Chef Jessy T',
  chefName:         'Jessica Thomas',
  chefRole:         'Founder & Head Chef',
};

const PILLARS = [
  {
    num:   '01',
    title: 'Scratch-Made Daily',
    body:  'Every dish is prepared fresh the morning of your event in our New York kitchen. Nothing leaves until it meets the standard.',
  },
  {
    num:   '02',
    title: 'Real Ingredients',
    body:  'We source locally wherever possible and choose quality over convenience on every single order, every single time.',
  },
  {
    num:   '03',
    title: 'Personal Consultation',
    body:  'Every booking begins with a conversation. We learn your event before we plan your menu — not the other way around.',
  },
  {
    num:   '04',
    title: 'Full-Service Execution',
    body:  'From delivery and setup to breakdown and cleanup — we handle every detail so you can be present for your guests.',
  },
];

export default function OurStoryPage() {
  const [a, setA] = useState(D);

  useEffect(() => {
    siteContentAPI.get()
      .then((res) => { if (res.data.content?.about) setA({ ...D, ...res.data.content.about }); })
      .catch(() => {});
  }, []);

  return (
    <div className="story">

      {/* ── Chapter marker ────────────────────────────── */}
      <div className="story__chapter-bar">
        <div className="story__chapter-rule" />
        <span className="story__chapter-label">Ch. 02 — Our Story</span>
        <div className="story__chapter-rule" />
      </div>

      {/* ── Opening spread ────────────────────────────── */}
      <header className="story__opening">
        <div className="story__opening-left">
          <div className="story__page-num">Page 02</div>
          <h1 className="story__heading">
            Born from<br />
            a belief that<br />
            <em>great food</em><br />
            brings people<br />
            <span className="story__heading-ul">home</span>.
          </h1>
          <div className="story__heading-note">
            Long Island, New York · Est. 2018
          </div>
        </div>

        <div className="story__opening-right">
          {/* Full-bleed photo with polaroid frame */}
          <div className="story__hero-frame">
            <div className="tape story__hero-tape" />
            <div className="story__hero-img">
              {a.mainPhotoUrl && (
                <img src={a.mainPhotoUrl} alt={a.mainPhotoCaption} />
              )}
              {/* Grain overlay */}
              <div className="story__hero-grain" />
            </div>
            <div className="story__hero-caption">{a.mainPhotoCaption}</div>
          </div>

          {/* Stamp */}
          <div className="story__stamp">
            <div className="story__stamp-inner">
              <div className="story__stamp-line">Chef's</div>
              <div className="story__stamp-main">Kitchen</div>
              <div className="story__stamp-line">No. 01</div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashed divider */}
      <div className="story__rule-full" />

      {/* ── Body text + quote ─────────────────────────── */}
      <div className="story__body-spread">

        {/* Sidebar — chapter annotation */}
        <aside className="story__annotation">
          <div className="story__annotation-line" />
          <div className="story__annotation-text">
            <span>¶</span> Founded 2018
          </div>
          <div className="story__annotation-text">
            <span>·</span> Long Island, NY
          </div>
          <div className="story__annotation-text">
            <span>·</span> 40+ dishes
          </div>
          <div className="story__annotation-text">
            <span>·</span> 8+ years of flavor
          </div>
          <div className="story__annotation-line" />
        </aside>

        {/* Main narrative */}
        <div className="story__narrative">
          <p className="story__body story__body--dropcap">{a.body}</p>

          <p className="story__body">
            Every event we cater starts the same way — a conversation about
            what matters. Who are you feeding? What are you celebrating?
            What flavors feel like home? The food is never the point.
            The moments are.
          </p>

          <blockquote className="story__pull-quote">
            <div className="story__pull-quote-mark">"</div>
            <p>{a.quote}</p>
            <footer className="story__pull-quote-attr">
              <div className="story__signature">{a.chefSignature}</div>
              <div className="story__attr-line">
                <span className="story__attr-name">{a.chefName}</span>
                <span className="story__attr-role">{a.chefRole}</span>
              </div>
            </footer>
          </blockquote>

          <p className="story__body">
            Our kitchen operates on one rule: if it doesn't taste as good
            as it smells, it doesn't leave. That's why every dish is prepared
            fresh the morning of your event. No pre-made bases. No reheated
            proteins. Real ingredients, handled with care, every time.
          </p>
        </div>
      </div>

      {/* ── Pull stat band ────────────────────────────── */}
      <div className="story__stats-band">
        {[
          { value: '8+',   label: 'Years in business' },
          { value: '40+',  label: 'Signature dishes'  },
          { value: '500+', label: 'Events catered'    },
          { value: '100%', label: 'Scratch-made'      },
        ].map((s) => (
          <div key={s.label} className="story__stat">
            <div className="story__stat-value">{s.value}</div>
            <div className="story__stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Pillars — no emojis, numbered cards ─────── */}
      <div className="story__pillars-section">
        <div className="story__pillars-header">
          <div className="story__pillars-folio">
            <span className="story__pillars-rule" />
            How we work
            <span className="story__pillars-rule" />
          </div>
          <h2 className="story__pillars-title">
            The standard we hold<br />
            <em>ourselves to</em>
          </h2>
        </div>

        <div className="story__pillars">
          {PILLARS.map((p) => (
            <div key={p.num} className="story__pillar">
              <div className="story__pillar-num">{p.num}</div>
              <div className="story__pillar-divider" />
              <h3 className="story__pillar-title">{p.title}</h3>
              <p className="story__pillar-body">{p.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────── */}
      <div className="story__cta">
        <div className="story__cta-inner">
          <div className="story__cta-folio">Ready when you are</div>
          <h2 className="story__cta-title">
            Let's make your<br />
            event <em>unforgettable</em>.
          </h2>
          <p className="story__cta-sub">
            From 20 guests to 200 — every booking gets the same care and
            attention. Start with a quote or browse our packages.
          </p>
          <div className="story__cta-actions">
            <a href="/packages" className="btn-primary">
              View Packages
              <span className="btn-primary__arrow">→</span>
            </a>
            <a href="/contact" className="story__cta-link">
              Get in touch
            </a>
          </div>
        </div>
        {/* Decorative torn edge */}
        <div className="torn-edge-bottom" />
      </div>

    </div>
  );
}
