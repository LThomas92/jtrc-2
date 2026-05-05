import { useEffect, useState } from 'react';
import { siteContentAPI } from '@lib/api';

const D = {
  line1:            'Food made',
  line2:            'with soul,',
  line3:            'served with love.',
  description:      'Scratch-made Southern comfort catering for the gatherings that matter most — from Sunday dinners to grand celebrations, all prepared with real ingredients and real heart.',
  featuredDish:     'Fried Mac & Cheese Balls',
  featuredDesc:     'Four-cheese béchamel, golden breadcrumb crust, smoked paprika aioli.',
  featuredPrice:    '$45',
  featuredServes:   'Serves · 12',
  featuredCaption:  '— Fried Mac & Cheese Balls —',
  featuredImageUrl: '',
};

export default function Hero() {
  const [h, setH] = useState(D);

  useEffect(() => {
    siteContentAPI.get()
      .then((res) => { if (res.data.content?.hero) setH({ ...D, ...res.data.content.hero }); })
      .catch(() => {});
  }, []);

  return (
    <section className="hero">
      <div className="hero__chapter-label">
        <span className="hero__line" />
        <span>Chapter 01 — Welcome</span>
      </div>
      <div className="hero__page-num">
        <span>Page 01</span>
        <span className="hero__line" />
      </div>

      <div className="hero__spread">
        {/* LEFT PAGE */}
        <div className="hero__page hero__page--left">
          <div className="hero__folio">A Comfort Food Catering Co.</div>
          <h1 className="hero__title">
            <span className="hero__title-line">{h.line1}</span>
            <span className="hero__title-line hero__title-line--italic">
              with <span className="hero__script">soul,</span>
            </span>
            <span className="hero__title-line">
              served <em>with love</em>.
            </span>
          </h1>
          <div className="hero__desc-row">
            <div className="hero__desc-label">¶ Intro</div>
            <p className="hero__desc">{h.description}</p>
          </div>
          <div className="hero__cta-row">
            <a href="/menu" className="btn-primary">
              Browse the Cookbook
              <span className="btn-primary__arrow">→</span>
            </a>
            <a href="/packages" className="btn-link">or view packages</a>
          </div>
        </div>

        {/* RIGHT PAGE */}
        <div className="hero__page hero__page--right">
          <div className="hero__showcase">

            {/* Featured dish photo tile */}
            <div className="hero__photo">
              <div className="tape hero__photo-tape" />

              {h.featuredImageUrl ? (
                // Real photo uploaded via admin
                <img
                  src={h.featuredImageUrl}
                  alt={h.featuredDish}
                  className="hero__photo-img"
                />
              ) : (
                // Fallback emoji placeholder
                <div className="hero__photo-emoji">🧀</div>
              )}

              <div className="hero__photo-stamp">
                Signature<br />No. 01
              </div>
            </div>

            <div className="hero__photo-caption">{h.featuredCaption}</div>

            {/* Recipe peek card */}
            <div className="hero__peek">
              <div className="tape hero__peek-tape" />
              <div className="hero__peek-header">
                <span className="hero__peek-num">Recipe No. 01</span>
                <span className="hero__peek-cat">Appetizer</span>
              </div>
              <div className="hero__peek-title">{h.featuredDish}</div>
              <div className="hero__peek-ing">{h.featuredDesc}</div>
              <div className="hero__peek-foot">
                <span className="hero__peek-serves">{h.featuredServes}</span>
                <span className="hero__peek-price">{h.featuredPrice}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
