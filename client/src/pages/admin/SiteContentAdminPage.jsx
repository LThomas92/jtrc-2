import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { siteContentAPI } from '@lib/api';

const HERO_DEFAULTS = {
  line1: 'Food made', line2: 'with soul,', line3: 'served with love.',
  description: 'Scratch-made Southern comfort catering for the gatherings that matter most.',
  featuredDish: 'Fried Mac & Cheese Balls',
  featuredDesc: 'Four-cheese béchamel, golden breadcrumb crust, smoked paprika aioli.',
  featuredPrice: '$45', featuredServes: 'Serves · 12',
  featuredCaption: '— Fried Mac & Cheese Balls —',
  featuredImageUrl: '',
};

const ABOUT_DEFAULTS = {
  stickerYears: '8+', stickerText: '✦ Since 2018 · Long Island New York · Made With Love',
  mainPhotoUrl: '', mainPhotoCaption: '— Chef Jessy T in the kitchen —',
  smallPhotoCaption: 'fresh herbs',
  title: 'Born from a belief that great food brings people home.',
  body: "JT's Rustic Cuisine was founded on a simple idea — food should taste like a memory.",
  quote: "My mother taught me that cooking isn't about following a recipe — it's about feeding the people you love.",
  chefSignature: '— Chef Jessy T', chefName: 'Jessica Thomas', chefRole: 'Founder & Head Chef',
};

const EMPTY_CARD = { imageUrl: '', dishName: '', text: '', author: '', event: '', city: '', date: '', year: '' };

export default function SiteContentAdminPage() {
  const [hero,           setHero]           = useState(HERO_DEFAULTS);
  const [about,          setAbout]          = useState(ABOUT_DEFAULTS);
  const [cards,          setCards]          = useState(Array(6).fill(null).map(() => ({ ...EMPTY_CARD })));
  const [heroImageFile,  setHeroImageFile]  = useState(null);
  const [aboutPhotoFile, setAboutPhotoFile] = useState(null);
  const [cardFiles,      setCardFiles]      = useState(Array(6).fill(null));
  const [loading,        setLoading]        = useState(true);
  const [saving,         setSaving]         = useState(false);
  const [dirty,          setDirty]          = useState(false);
  const [tab,            setTab]            = useState('hero');
  const [expandedCard,   setExpandedCard]   = useState(0);

  useEffect(() => {
    siteContentAPI.get()
      .then((res) => {
        const c = res.data.content;
        if (c?.hero)  setHero((p) => ({ ...p, ...c.hero }));
        if (c?.about) setAbout((p) => ({ ...p, ...c.about }));
        if (c?.postcards?.cards?.length) {
          setCards(Array(6).fill(null).map((_, i) =>
            c.postcards.cards[i] ? { ...EMPTY_CARD, ...c.postcards.cards[i] } : { ...EMPTY_CARD }
          ));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setH = (key, val) => { setHero((p)  => ({ ...p, [key]: val })); setDirty(true); };
  const setA = (key, val) => { setAbout((p) => ({ ...p, [key]: val })); setDirty(true); };

  const setCardField = (idx, key, val) => {
    setCards((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [key]: val };
      return next;
    });
    setDirty(true);
  };

  const setCardFile = (idx, file) => {
    setCardFiles((prev) => { const next = [...prev]; next[idx] = file; return next; });
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      data.append('hero',      JSON.stringify(hero));
      data.append('about',     JSON.stringify(about));
      data.append('postcards', JSON.stringify({ cards }));

      if (heroImageFile instanceof File)  data.append('heroImage',  heroImageFile);
      if (aboutPhotoFile instanceof File) data.append('aboutPhoto', aboutPhotoFile);
      cardFiles.forEach((file, i) => {
        if (file instanceof File) data.append(`postcardImage_${i}`, file);
      });

      await siteContentAPI.update(data);
      toast.success('Site content saved');
      setDirty(false);
      setHeroImageFile(null);
      setAboutPhotoFile(null);
      setCardFiles(Array(6).fill(null));
    } catch {
      toast.error('Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const heroImgPreview  = heroImageFile  ? URL.createObjectURL(heroImageFile)  : hero.featuredImageUrl  || null;
  const aboutImgPreview = aboutPhotoFile ? URL.createObjectURL(aboutPhotoFile) : about.mainPhotoUrl || null;

  if (loading) return <div className="admin-sc"><p className="admin-dash__empty">Loading…</p></div>;

  return (
    <div className="admin-sc">
      <header className="admin-sc__header">
        <div>
          <div className="admin-sc__folio">Homepage — Site Content</div>
          <h1 className="admin-sc__title">Edit <em>Content</em></h1>
          <p className="admin-sc__sub">Changes go live instantly on save.</p>
        </div>
        <button
          className={`admin-pkg__save-btn ${dirty ? 'admin-pkg__save-btn--dirty' : ''}`}
          onClick={handleSave} disabled={saving || !dirty}>
          {saving ? 'Saving…' : dirty ? 'Save Changes →' : 'Up to date ✓'}
        </button>
      </header>

      <div className="admin-sc__tabs">
        {['hero', 'about', 'postcards'].map((t) => (
          <button key={t}
            className={`admin-sc__tab ${tab === t ? 'admin-sc__tab--active' : ''}`}
            onClick={() => setTab(t)}>
            {t === 'hero' ? 'Hero' : t === 'about' ? 'About' : 'Postcards'}
          </button>
        ))}
      </div>

      {/* ── HERO ─────────────────────────────────────── */}
      {tab === 'hero' && (
        <div className="admin-sc__section">
          <div className="admin-sc__section-label">Headline</div>
          <div className="admin-sc__group">
            {['line1','line2','line3'].map((k,i) => (
              <div key={k} className="admin-pkg__field">
                <label className="admin-pkg__label">Line {i+1}</label>
                <input className="admin-pkg__input" value={hero[k]} onChange={(e) => setH(k, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="admin-sc__section-label">Intro Description</div>
          <textarea className="admin-sc__textarea" rows={3} value={hero.description}
            onChange={(e) => setH('description', e.target.value)} />
          <div className="admin-sc__section-label">Featured Dish</div>
          <div className="admin-sc__featured-dish">
            <div className="admin-sc__featured-photo-col">
              <div className="admin-sc__featured-preview">
                {heroImgPreview ? <img src={heroImgPreview} alt="Featured dish" /> : <div className="admin-sc__featured-empty">No photo</div>}
              </div>
              <div className="admin-menu__upload-zone admin-sc__featured-upload">
                <input type="file" accept="image/*" onChange={(e) => { setHeroImageFile(e.target.files[0]); setDirty(true); }} />
                <div className="admin-menu__upload-icon" style={{ fontSize:'1rem',marginBottom:4 }}>📷</div>
                <span className="admin-menu__upload-label">{heroImageFile ? heroImageFile.name : hero.featuredImageUrl ? 'Replace' : 'Upload photo'}</span>
                <span className="admin-menu__upload-hint">JPG, PNG or WEBP · max 4 MB</span>
              </div>
            </div>
            <div className="admin-sc__featured-fields">
              {[['featuredDish','Dish Name'],['featuredDesc','Description'],['featuredPrice','Price'],['featuredServes','Serves'],['featuredCaption','Caption']].map(([k,label]) => (
                <div key={k} className="admin-pkg__field">
                  <label className="admin-pkg__label">{label}</label>
                  <input className="admin-pkg__input" value={hero[k]} onChange={(e) => setH(k, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ABOUT ────────────────────────────────────── */}
      {tab === 'about' && (
        <div className="admin-sc__section">
          <div className="admin-sc__section-label">Sticker</div>
          <div className="admin-sc__group admin-sc__group--grid">
            <div className="admin-pkg__field">
              <label className="admin-pkg__label">Years badge</label>
              <input className="admin-pkg__input" value={about.stickerYears} onChange={(e) => setA('stickerYears', e.target.value)} />
            </div>
            <div className="admin-pkg__field">
              <label className="admin-pkg__label">Circular text</label>
              <input className="admin-pkg__input" value={about.stickerText} onChange={(e) => setA('stickerText', e.target.value)} />
            </div>
          </div>
          <div className="admin-sc__section-label">Main Photo</div>
          <div className="admin-sc__featured-dish">
            <div className="admin-sc__featured-photo-col">
              <div className="admin-sc__featured-preview admin-sc__featured-preview--portrait">
                {aboutImgPreview ? <img src={aboutImgPreview} alt="About" /> : <div className="admin-sc__featured-empty">No photo</div>}
              </div>
              <div className="admin-menu__upload-zone admin-sc__featured-upload">
                <input type="file" accept="image/*" onChange={(e) => { setAboutPhotoFile(e.target.files[0]); setDirty(true); }} />
                <div className="admin-menu__upload-icon" style={{ fontSize:'1rem',marginBottom:4 }}>📷</div>
                <span className="admin-menu__upload-label">{aboutPhotoFile ? aboutPhotoFile.name : about.mainPhotoUrl ? 'Replace' : 'Upload'}</span>
                <span className="admin-menu__upload-hint">JPG, PNG or WEBP · max 4 MB</span>
              </div>
            </div>
            <div className="admin-sc__featured-fields">
              <div className="admin-pkg__field">
                <label className="admin-pkg__label">Main photo caption</label>
                <input className="admin-pkg__input" value={about.mainPhotoCaption} onChange={(e) => setA('mainPhotoCaption', e.target.value)} />
              </div>
              <div className="admin-pkg__field">
                <label className="admin-pkg__label">Small polaroid caption</label>
                <input className="admin-pkg__input" value={about.smallPhotoCaption} onChange={(e) => setA('smallPhotoCaption', e.target.value)} />
              </div>
            </div>
          </div>
          <div className="admin-sc__section-label">Story Text</div>
          <div className="admin-sc__group">
            <div className="admin-pkg__field">
              <label className="admin-pkg__label">Section title</label>
              <input className="admin-pkg__input" value={about.title} onChange={(e) => setA('title', e.target.value)} />
            </div>
            <div className="admin-pkg__field">
              <label className="admin-pkg__label">Body paragraph</label>
              <textarea className="admin-sc__textarea" rows={4} value={about.body} onChange={(e) => setA('body', e.target.value)} />
            </div>
            <div className="admin-pkg__field">
              <label className="admin-pkg__label">Pull quote</label>
              <textarea className="admin-sc__textarea" rows={2} value={about.quote} onChange={(e) => setA('quote', e.target.value)} />
            </div>
          </div>
          <div className="admin-sc__section-label">Signature</div>
          <div className="admin-sc__group admin-sc__group--grid">
            {[['chefSignature','Signature line'],['chefName','Full name'],['chefRole','Role']].map(([k,label]) => (
              <div key={k} className="admin-pkg__field">
                <label className="admin-pkg__label">{label}</label>
                <input className="admin-pkg__input" value={about[k]} onChange={(e) => setA(k, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── POSTCARDS ────────────────────────────────── */}
      {tab === 'postcards' && (
        <div className="admin-sc__section">
          <div className="admin-sc__section-label">Postcard Reviews</div>
          <p style={{ fontFamily:'var(--font-serif)', fontStyle:'italic', color:'var(--color-ink-soft)', fontSize:'0.9rem', marginBottom:28 }}>
            Each postcard appears on the homepage reviews section. Upload a food photo, fill in the review details, and save.
          </p>

          <div className="admin-sc__postcard-accordion">
            {cards.map((card, i) => {
              const preview  = cardFiles[i] ? URL.createObjectURL(cardFiles[i]) : card.imageUrl || null;
              const isOpen   = expandedCard === i;

              return (
                <div key={i} className={`admin-sc__postcard-panel ${isOpen ? 'admin-sc__postcard-panel--open' : ''}`}>
                  <button
                    className="admin-sc__postcard-toggle"
                    onClick={() => setExpandedCard(isOpen ? null : i)}
                  >
                    <div className="admin-sc__postcard-toggle-left">
                      {preview && (
                        <div className="admin-sc__postcard-thumb">
                          <img src={preview} alt="" />
                        </div>
                      )}
                      <div>
                        <div className="admin-sc__postcard-num">Postcard {i + 1}</div>
                        <div className="admin-sc__postcard-preview-text">
                          {card.author || 'No author yet'} {card.event ? `· ${card.event}` : ''}
                        </div>
                      </div>
                    </div>
                    <span className="admin-pkg__panel-chevron">{isOpen ? '▲' : '▼'}</span>
                  </button>

                  {isOpen && (
                    <div className="admin-sc__postcard-body">
                      {/* Photo upload */}
                      <div className="admin-sc__postcard-photo-row">
                        <div className="admin-sc__postcard-photo-preview">
                          {preview
                            ? <img src={preview} alt="Postcard photo" />
                            : <div className="admin-sc__postcard-no-photo">No photo</div>}
                        </div>
                        <div className="admin-menu__upload-zone" style={{ flex:1 }}>
                          <input type="file" accept="image/*"
                            onChange={(e) => { if (e.target.files[0]) setCardFile(i, e.target.files[0]); }} />
                          <div className="admin-menu__upload-icon" style={{ fontSize:'1rem', marginBottom:4 }}>📷</div>
                          <span className="admin-menu__upload-label">
                            {cardFiles[i] ? cardFiles[i].name : card.imageUrl ? 'Replace photo' : 'Upload photo'}
                          </span>
                          <span className="admin-menu__upload-hint">JPG, PNG or WEBP · max 4 MB</span>
                        </div>
                      </div>

                      {/* Fields grid */}
                      <div className="admin-sc__postcard-fields">
                        <div className="admin-pkg__field admin-sc__postcard-field--full">
                          <label className="admin-pkg__label">Dish name (badge on photo)</label>
                          <input className="admin-pkg__input" placeholder="e.g. Fried Mac & Cheese Balls"
                            value={card.dishName} onChange={(e) => setCardField(i, 'dishName', e.target.value)} />
                        </div>

                        <div className="admin-pkg__field admin-sc__postcard-field--full">
                          <label className="admin-pkg__label">Review text</label>
                          <textarea className="admin-sc__textarea" rows={3}
                            placeholder="The review from the guest…"
                            value={card.text} onChange={(e) => setCardField(i, 'text', e.target.value)} />
                        </div>

                        <div className="admin-pkg__field">
                          <label className="admin-pkg__label">Author name</label>
                          <input className="admin-pkg__input" placeholder="e.g. Lawrence T."
                            value={card.author} onChange={(e) => setCardField(i, 'author', e.target.value)} />
                        </div>

                        <div className="admin-pkg__field">
                          <label className="admin-pkg__label">Event type</label>
                          <input className="admin-pkg__input" placeholder="e.g. House Warming"
                            value={card.event} onChange={(e) => setCardField(i, 'event', e.target.value)} />
                        </div>

                        <div className="admin-pkg__field">
                          <label className="admin-pkg__label">City</label>
                          <input className="admin-pkg__input" placeholder="e.g. Jersey City"
                            value={card.city} onChange={(e) => setCardField(i, 'city', e.target.value)} />
                        </div>

                        <div className="admin-pkg__field">
                          <label className="admin-pkg__label">Date  e.g. Oct 26</label>
                          <input className="admin-pkg__input" placeholder="Oct 26"
                            value={card.date} onChange={(e) => setCardField(i, 'date', e.target.value)} />
                        </div>

                        <div className="admin-pkg__field">
                          <label className="admin-pkg__label">Year  e.g. NY · 2022</label>
                          <input className="admin-pkg__input" placeholder="NY · 2022"
                            value={card.year} onChange={(e) => setCardField(i, 'year', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ paddingTop:24, borderTop:'1px dashed rgba(0,0,0,0.12)', marginTop:8 }}>
        <button
          className={`admin-pkg__save-btn ${dirty ? 'admin-pkg__save-btn--dirty' : ''}`}
          onClick={handleSave} disabled={saving || !dirty}>
          {saving ? 'Saving…' : dirty ? 'Save Changes →' : 'Up to date ✓'}
        </button>
      </div>
    </div>
  );
}
