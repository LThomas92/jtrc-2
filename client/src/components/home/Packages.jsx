import { useEffect, useState } from 'react';
import { packagesAPI } from '@lib/api';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    packagesAPI
      .getAll()
      .then((res) => setPackages(res.data.packages || []))
      .catch((err) => console.error('Failed to load packages:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="packages">
        <div className="packages__header">
          <div className="packages__folio">
            <strong>Ch. 04</strong>
            <span>Catering Packages</span>
          </div>
          <h2 className="packages__heading">
            Choose your <em>experience</em>
          </h2>
        </div>
        <div className="packages__grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="package-card package-card--loading" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="packages">

      <div className="packages__header">
        <div className="packages__folio">
          <strong>Ch. 04</strong>
          <span>Catering Packages</span>
        </div>
        <h2 className="packages__heading">
          Choose your <em>experience</em>
        </h2>
        <p className="packages__sub">
          From intimate Sunday dinners to grand celebrations — all prepared
          with the same care and soul.
        </p>
      </div>

      <div className="packages__grid">
        {packages.map((pkg) => (
          <article
            key={pkg._id}
            className={`package-card ${pkg.featured ? 'package-card--featured' : ''}`}
          >
            <div className="package-card__stub">
              {pkg.slug === 'gathering'   && '№ 001 · Admit One'}
              {pkg.slug === 'celebration' && '№ 002 · Admit One'}
              {pkg.slug === 'feast'       && '№ 003 · Admit One'}
              {!['gathering','celebration','feast'].includes(pkg.slug) && '№ — · Admit One'}
            </div>

            {pkg.featured && (
              <div className="package-card__ribbon">Most Popular</div>
            )}

            <div className="package-card__content">
              <div className="package-card__label">{pkg.label}</div>
              <div className="package-card__name">
                The <em>{pkg.name}</em>
              </div>
              <div className="package-card__guests">{pkg.guests}</div>
              <div className="package-card__price-row">
                <span className="package-card__price">${pkg.price}</span>
                <span className="package-card__price-per">/ per person</span>
              </div>
              <div className="package-card__minimum">{pkg.minimum}</div>
              <div className="package-card__divider" />

              {/* ── Service features ─────────────────── */}
              <ul className="package-card__features">
                {(pkg.features || []).map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              {/* ── Food includes ────────────────────── */}
              {pkg.includes && pkg.includes.length > 0 && (
                <>
                  <div className="package-card__includes-label">
                    This package includes:
                  </div>
                  <ul className="package-card__includes">
                    {pkg.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              <a href="/contact" className="package-card__btn">
                Request Quote <span>→</span>
              </a>
            </div>
          </article>
        ))}

        {packages.length === 0 && (
          <p style={{
            gridColumn: '1/-1',
            textAlign: 'center',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.5)',
            padding: '60px 0',
          }}>
            No packages available yet.
          </p>
        )}
      </div>
    </section>
  );
}
