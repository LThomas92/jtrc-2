import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { siteContentAPI } from '@lib/api';

const HERO_DEFAULTS = {
  line1: 'Food made', line2: 'with soul,', line3: 'served with love.',
  description: 'Scratch-made Southern comfort catering for the gatherings that matter most — from Sunday dinners to grand celebrations, all prepared with real ingredients and real heart.',
  featuredDish: 'Fried Mac & Cheese Balls',
  featuredDesc: 'Four-cheese béchamel, golden breadcrumb crust, smoked paprika aioli.',
  featuredPrice: '$45',
  featuredServes: 'Serves · 12',
  featuredCaption: '— Fried Mac & Cheese Balls —',
  featuredImageUrl: '',
};

const ABOUT_DEFAULTS = {
  stickerYears: '8+',
  stickerText: '✦ Since 2018 · Long Island New York · Made With Love',
  mainPhotoUrl: '',
  mainPhotoCaption: '— Chef Jessy T in the kitchen —',
  smallPhotoCaption: 'fresh herbs',
  title: 'Born from a belief that great food brings people home.',
  body: "JT's Rustic Cuisine was founded on a simple idea — food should taste like a memory. Every dish we serve is made from scratch in our New York kitchen, using real ingredients and recipes passed down through generations of family cooks. No shortcuts. No substitutions. Just comfort food with soul.",
  quote: "My mother taught me that cooking isn't about following a recipe — it's about feeding the people you love.",
  chefSignature: '— Chef Jessy T',
  chefName: 'Jessica Thomas',
  chefRole: 'Founder & Head Chef',
};

export default function SiteContentAdminPage() {
  const [hero,           setHero]           = useState(HERO_DEFAULTS);
  const [about,          setAbout]          = useState(ABOUT_DEFAULTS);
  const [heroImageFile,  setHeroImageFile]  = useState(null);
  const [aboutPhotoFile, setAboutPhotoFile] = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [saving,         setSaving]         = useState(false);
  const [dirty,          setDirty]          = useState(false);
  const [tab,            setTab]            = useState('hero');

  useEffect(() => {
    siteContentAPI.get()
      .then((res) => {
        const c = res.data.content;
        if (c?.hero)  setHero((prev) => ({ ...prev, ...c.hero }));
        if (c?.about) setAbout((prev) => ({ ...prev, ...c.about }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setH = (key, val) => { setHero((p)  => ({ ...p, [key]: val })); setDirty(true); };
  const setA = (key, val) => { setAbout((p) => ({ ...p, [key]: val })); setDirty(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = new FormData();

      // Send hero text fields as JSON
      data.append('hero', JSON.stringify(hero));
      // Send about text fields as JSON
      data.append('about', JSON.stringify(about));

      // Append image files if selected — these are the actual File objects
      if (heroImageFile instanceof File) {
        data.append('heroImage', heroImageFile);
        console.log('Appending heroImage:', heroImageFile.name, heroImageFile.size);
      }
      if (aboutPhotoFile instanceof File) {
        data.append('aboutPhoto', aboutPhotoFile);
      }

      // Debug — log what's in FormData before sending
      for (const [key, val] of data.entries()) {
        console.log('FormData field:', key, val instanceof File ? `FILE: ${val.name}` : val.slice?.(0, 60));
      }

      await siteContentAPI.update(data);
      toast.success('Site content saved');
      setDirty(false);
      setHeroImageFile(null);
      setAboutPhotoFile(null);
    } catch (err) {
      console.error('Save error:', err);
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
          onClick={handleSave}
          disabled={saving || !dirty}
        >
          {saving ? 'Saving…' : dirty ? 'Save Changes →' : 'Up to date ✓'}
        </button>
      </header>

      <div className="admin-sc__tabs">
        {['hero', 'about'].map((t) => (
          <button key={t}
            className={`admin-sc__tab ${tab === t ? 'admin-sc__tab--active' : ''}`}
            onClick={() => setTab(t)}>
            {t === 'hero' ? 'Hero Section' : 'About Section'}
          </button>
        ))}
      </div>

      {/* ── HERO TAB ──────────────────────────────────── */}
      {tab === 'hero' && (
        <div className="admin-sc__section">

          <div className="admin-sc__section-label">Headline</div>
          <div className="admin-sc__group">
            {['line1', 'line2', 'line3'].map((k, i) => (
              <div key={k} className="admin-pkg__field">
                <label className="admin-pkg__label">Line {i + 1}</label>
                <input className="admin-pkg__input" value={hero[k]}
                  onChange={(e) => setH(k, e.target.value)} />
              </div>
            ))}
          </div>

          <div className="admin-sc__section-label">Intro Description</div>
          <textarea className="admin-sc__textarea" rows={3}
            value={hero.description}
            onChange={(e) => setH('description', e.target.value)} />

          {/* Featured dish — photo + fields inline */}
          <div className="admin-sc__section-label">Featured Dish</div>
          <div className="admin-sc__featured-dish">

            <div className="admin-sc__featured-photo-col">
              <div className="admin-sc__featured-preview">
                {heroImgPreview
                  ? <img src={heroImgPreview} alt="Featured dish" />
                  : <div className="admin-sc__featured-empty">🧀</div>}
              </div>
              <div className="admin-menu__upload-zone admin-sc__featured-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setHeroImageFile(file);
                      setDirty(true);
                      console.log('Hero image selected:', file.name, file.size);
                    }
                  }}
                />
                <div className="admin-menu__upload-icon" style={{ fontSize: '1rem', marginBottom: 4 }}>📷</div>
                <span className="admin-menu__upload-label">
                  {heroImageFile
                    ? heroImageFile.name
                    : hero.featuredImageUrl ? 'Replace photo' : 'Upload photo'}
                </span>
                <span className="admin-menu__upload-hint">JPG, PNG or WEBP · max 4 MB</span>
              </div>
              {heroImageFile && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--color-olive)', marginTop: 4 }}>
                  ✓ {heroImageFile.name} ready to upload
                </p>
              )}
            </div>

            <div className="admin-sc__featured-fields">
              <div className="admin-pkg__field">
                <label className="admin-pkg__label">Dish Name</label>
                <input className="admin-pkg__input" value={hero.featuredDish}
                  onChange={(e) => setH('featuredDish', e.target.value)} />
              </div>
              <div className="admin-pkg__field">
                <label className="admin-pkg__label">Description</label>
                <input className="admin-pkg__input" value={hero.featuredDesc}
                  onChange={(e) => setH('featuredDesc', e.target.value)} />
              </div>
              <div className="admin-sc__featured-row">
                <div className="admin-pkg__field">
                  <label className="admin-pkg__label">Price</label>
                  <input className="admin-pkg__input" placeholder="$45"
                    value={hero.featuredPrice}
                    onChange={(e) => setH('featuredPrice', e.target.value)} />
                </div>
                <div className="admin-pkg__field">
                  <label className="admin-pkg__label">Serves</label>
                  <input className="admin-pkg__input" placeholder="Serves · 12"
                    value={hero.featuredServes}
                    onChange={(e) => setH('featuredServes', e.target.value)} />
                </div>
              </div>
              <div className="admin-pkg__field">
                <label className="admin-pkg__label">Photo Caption</label>
                <input className="admin-pkg__input" placeholder="— Dish Name —"
                  value={hero.featuredCaption}
                  onChange={(e) => setH('featuredCaption', e.target.value)} />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── ABOUT TAB ─────────────────────────────────── */}
      {tab === 'about' && (
        <div className="admin-sc__section">

          <div className="admin-sc__section-label">Sticker</div>
          <div className="admin-sc__group admin-sc__group--grid">
            <div className="admin-pkg__field">
              <label className="admin-pkg__label">Years badge  e.g. 8+</label>
              <input className="admin-pkg__input" value={about.stickerYears}
                onChange={(e) => setA('stickerYears', e.target.value)} />
            </div>
            <div className="admin-pkg__field">
              <label className="admin-pkg__label">Circular text</label>
              <input className="admin-pkg__input" value={about.stickerText}
                onChange={(e) => setA('stickerText', e.target.value)} />
            </div>
          </div>

          <div className="admin-sc__section-label">Main Photo</div>
          <div className="admin-sc__featured-dish">
            <div className="admin-sc__featured-photo-col">
              <div className="admin-sc__featured-preview admin-sc__featured-preview--portrait">
                {aboutImgPreview
                  ? <img src={aboutImgPreview} alt="About" />
                  : <div className="admin-sc__featured-empty">👨‍🍳</div>}
              </div>
              <div className="admin-menu__upload-zone admin-sc__featured-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) { setAboutPhotoFile(file); setDirty(true); }
                  }}
                />
                <div className="admin-menu__upload-icon" style={{ fontSize: '1rem', marginBottom: 4 }}>📷</div>
                <span className="admin-menu__upload-label">
                  {aboutPhotoFile ? aboutPhotoFile.name : about.mainPhotoUrl ? 'Replace photo' : 'Upload photo'}
                </span>
                <span className="admin-menu__upload-hint">JPG, PNG or WEBP · max 4 MB</span>
              </div>
            </div>
            <div className="admin-sc__featured-fields">
              <div className="admin-pkg__field">
                <label className="admin-pkg__label">Main photo caption</label>
                <input className="admin-pkg__input" value={about.mainPhotoCaption}
                  onChange={(e) => setA('mainPhotoCaption', e.target.value)} />
              </div>
              <div className="admin-pkg__field">
                <label className="admin-pkg__label">Small polaroid caption</label>
                <input className="admin-pkg__input" value={about.smallPhotoCaption}
                  onChange={(e) => setA('smallPhotoCaption', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="admin-sc__section-label">Story Text</div>
          <div className="admin-sc__group">
            <div className="admin-pkg__field">
              <label className="admin-pkg__label">Section title</label>
              <input className="admin-pkg__input" value={about.title}
                onChange={(e) => setA('title', e.target.value)} />
            </div>
            <div className="admin-pkg__field">
              <label className="admin-pkg__label">Body paragraph</label>
              <textarea className="admin-sc__textarea" rows={4} value={about.body}
                onChange={(e) => setA('body', e.target.value)} />
            </div>
            <div className="admin-pkg__field">
              <label className="admin-pkg__label">Pull quote (without quotes)</label>
              <textarea className="admin-sc__textarea" rows={2} value={about.quote}
                onChange={(e) => setA('quote', e.target.value)} />
            </div>
          </div>

          <div className="admin-sc__section-label">Signature</div>
          <div className="admin-sc__group admin-sc__group--grid">
            {[
              ['chefSignature', 'Signature line  e.g. — Chef Jessy T'],
              ['chefName',      'Full name'],
              ['chefRole',      'Role / title'],
            ].map(([k, label]) => (
              <div key={k} className="admin-pkg__field">
                <label className="admin-pkg__label">{label}</label>
                <input className="admin-pkg__input" value={about[k]}
                  onChange={(e) => setA(k, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ paddingTop: 24, borderTop: '1px dashed rgba(0,0,0,0.12)', marginTop: 8 }}>
        <button
          className={`admin-pkg__save-btn ${dirty ? 'admin-pkg__save-btn--dirty' : ''}`}
          onClick={handleSave}
          disabled={saving || !dirty}
        >
          {saving ? 'Saving…' : dirty ? 'Save Changes →' : 'Up to date ✓'}
        </button>
      </div>
    </div>
  );
}
